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
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Creates a Modal for text input for the content of post to be updated by the bot.
 */
export const handleEdit: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member, guild } = interaction;
    const link = interaction.options.getString("link", true).split("/");
    const channelId = link[link.length - 2];
    const messageId = link[link.length - 1];

    const channel = guild.channels.resolve(channelId);

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
        ephemeral: true,
      });
      return;
    }
    if (!channel?.isTextBased()) {
      await interaction.reply({
        content: t("commands:post.edit.invalid"),
      });
      return;
    }

    const targetMessage = await FetchWrapper.message(channel, messageId);

    if (!targetMessage) {
      await interaction.reply({
        content: t("commands:post.edit.doesnt-exist"),
        ephemeral: true,
      });
      return;
    }

    if (targetMessage.author !== Becca.user) {
      await interaction.reply({
        content: t("commands:post.edit.cant-edit"),
        ephemeral: true,
      });
      return;
    }

    const editModal = new ModalBuilder()
      .setCustomId(`pe-${channelId}-${messageId}`)
      .setTitle("post edit");
    const contentInput = new TextInputBuilder()
      .setCustomId("content-input")
      .setLabel("Enter the updated text for the post: ")
      .setStyle(TextInputStyle.Paragraph)
      .setValue(targetMessage.content)
      .setMaxLength(4000)
      .setRequired(true);
    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      contentInput
    );
    editModal.addComponents(row);
    await interaction.showModal(editModal);
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post edit command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Becca, "edit", errorId, t)],
    });
  }
};
