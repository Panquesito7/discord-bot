import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Fetches a user's moderation history from the database and parses it for display.
 */
export const handleHistory: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const targetMember = await FetchWrapper.member(guild, target.id);

    if (
      (!member.permissions.has(PermissionFlagsBits.KickMembers) &&
        !member.permissions.has(PermissionFlagsBits.BanMembers) &&
        !member.permissions.has(PermissionFlagsBits.ModerateMembers)) ||
      (targetMember &&
        (targetMember.permissions.has(PermissionFlagsBits.KickMembers) ||
          targetMember.permissions.has(PermissionFlagsBits.BanMembers) ||
          targetMember.permissions.has(PermissionFlagsBits.ModerateMembers)))
    ) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    const targetRecord = await Becca.db.histories.findUnique({
      where: {
        serverId_userId: {
          serverId: guild.id,
          userId: target.id,
        },
      },
    });

    if (!targetRecord) {
      await interaction.editReply({
        content: t("commands:mod.history.clean"),
      });
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle(t("commands:mod.history.title", { user: target.tag }));
    embed.setDescription(t("commands:mod.history.description"));
    embed.setColor(Becca.colours.default);
    embed.setThumbnail(target.displayAvatarURL());
    embed.addFields([
      {
        name: t("commands:mod.history.ban"),
        value: String(targetRecord.bans),
        inline: true,
      },
      {
        name: t("commands:mod.history.unban"),
        value: String(targetRecord.unbans),
        inline: true,
      },
      {
        name: t("commands:mod.history.kick"),
        value: String(targetRecord.kicks),
        inline: true,
      },
      {
        name: t("commands:mod.history.warn"),
        value: String(targetRecord.warns),
        inline: true,
      },
      {
        name: t("commands:mod.history.mute"),
        value: String(targetRecord.mutes),
        inline: true,
      },
      {
        name: t("commands:mod.history.unmute"),
        value: String(targetRecord.unmutes),
        inline: true,
      },
    ]);

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "history command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "history", errorId, t)],
    });
  }
};
