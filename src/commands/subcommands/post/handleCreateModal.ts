import { PermissionFlagsBits } from "discord.js";

import { ModalHandler } from "../../../interfaces/modals/ModalHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

export const handleCreateModal: ModalHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild } = interaction;

    if (!guild.members.me) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:missingGuild"),
      });
      return;
    }

    const targetChannelId = interaction.customId.split("-")[1];
    const targetChannel = guild.channels.resolve(targetChannelId);

    if (!targetChannel?.isTextBased()) {
      await interaction.editReply(
        t("commands:post.create.nonTextChannel", {
          channelId: targetChannelId,
        })
      );
      return;
    }

    if (
      !targetChannel
        .permissionsFor(guild.members.me)
        .has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ])
    ) {
      await interaction.editReply(
        t("commands:post.create.noPerms", {
          channelId: targetChannelId,
        })
      );
      return;
    }
    const contentInput = interaction.fields.getTextInputValue("content-input");

    await targetChannel.send({ content: contentInput });
    await interaction.editReply({
      content: t("commands:post.create.success", {
        channelId: targetChannelId,
      }),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post create command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "post create modal", errorId, t)],
    });
  }
};
