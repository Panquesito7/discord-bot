import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Creates a Modal for text input for the content of post to be updated by the bot.
 */
export const handleDelete: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { member, guild } = interaction;
    const link = interaction.options.getString("link", true).split("/");
    const channelId = link[link.length - 2];
    const messageId = link[link.length - 1];

    const channel = guild.channels.resolve(channelId);

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }
    if (!channel?.isTextBased()) {
      await interaction.reply({
        content: t("commands:post.delete.invalid"),
      });
      return;
    }

    const targetMessage = await FetchWrapper.message(channel, messageId);

    if (!targetMessage) {
      await interaction.editReply({
        content: t("commands:post.delete.doesnt-exist"),
      });
      return;
    }

    if (targetMessage.author !== Becca.user || !targetMessage.deletable) {
      await interaction.editReply({
        content: t("commands:post.delete.cant-delete"),
      });
      return;
    }
    await targetMessage.delete();
    await interaction.reply({
      content: t("commands:post.delete.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post delete command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.reply({
      embeds: [errorEmbedGenerator(Becca, "delete", errorId, t)],
    });
  }
};
