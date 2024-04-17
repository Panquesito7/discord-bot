import { PermissionFlagsBits } from "discord.js";

import { ModalHandler } from "../../../interfaces/modals/ModalHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

export const handleEditModal: ModalHandler = async (Becca, interaction, t) => {
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
    const targetMessageId = interaction.customId.split("-")[2];
    const targetChannel = guild.channels.resolve(targetChannelId);

    if (
      !targetChannel?.isTextBased() ||
      !targetChannel
        .permissionsFor(guild.members.me)
        .has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ])
    ) {
      await interaction.editReply(
        t("commands:post.edit.failure", {
          link: `<https://discord.com/channels/${guild.id}/${targetChannelId}/${targetMessageId}>`,
        })
      );
      return;
    }

    const targetMessage = await FetchWrapper.message(
      targetChannel,
      targetMessageId
    );

    const contentInput = interaction.fields.getTextInputValue("content-input");

    if (!targetMessage) {
      await interaction.reply({
        content: t("commands:post.edit.doesnt-exist"),
      });
      return;
    }

    await targetMessage.edit({
      content: contentInput,
    });
    await interaction.editReply({
      content: t("commands:post.edit.success", {
        link: `<https://discord.com/channels/${guild.id}/${targetChannelId}/${targetMessageId}>`,
      }),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "post edit command",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "post edit modal", errorId, t)],
    });
  }
};
