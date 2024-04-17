import {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Creates a Modal for text input for the content of posts created by the bot.
 */
export const handleCreate: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member } = interaction;

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    const channel = interaction.options.getChannel("channel", true);
    const createModal = new ModalBuilder()
      .setCustomId(`pc-${channel.id}`)
      .setTitle("post create");
    const contentInput = new TextInputBuilder()
      .setCustomId("content-input")
      .setLabel("Enter the text you want to send in the post: ")
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(4000)
      .setRequired(true);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      contentInput
    );
    createModal.addComponents(row);
    await interaction.showModal(createModal);
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post create command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Becca, "create", errorId, t)],
    });
  }
};
