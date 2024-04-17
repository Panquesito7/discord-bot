import { ChannelType, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Adds Becca's announcement channel to a channel.
 */
export const handleAnnouncements: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { member } = interaction;
    const target = interaction.options.getChannel("channel", true, [
      ChannelType.GuildText,
    ]);

    if (!member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    const home = await FetchWrapper.guild(Becca, Becca.configs.homeGuild);
    const me = await FetchWrapper.becca(Becca, home);

    if (!me?.permissionsIn(target).has(PermissionFlagsBits.ManageWebhooks)) {
      await interaction.editReply({
        content: t("commands:becca.announcements.noPerms"),
      });
      return;
    }

    const announcementChannel = await FetchWrapper.channel(
      home,
      Becca.configs.announcementChannel
    );

    if (announcementChannel?.type !== ChannelType.GuildAnnouncement) {
      await interaction.editReply({
        content: t("commands:becca.announcements.noAnnouncements"),
      });
      return;
    }

    await announcementChannel.addFollower(
      target,
      "Requested via `/becca announcements` command."
    );
    await interaction.editReply({
      content: t<string, string>("commands:becca.announcements.success", {
        channel: target.toString(),
      }),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "uptime command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "announcements", errorId, t)],
    });
  }
};
