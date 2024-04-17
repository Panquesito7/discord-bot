import { GuildMember, EmbedBuilder, PartialGuildMember } from "discord.js";
import { getFixedT } from "i18next";

import { defaultServer } from "../../config/database/defaultServer";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { memberRemoveCleanup } from "../../modules/guild/memberRemoveCleanup";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { sendWelcomeEmbed } from "../../modules/guild/sendWelcomeEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Handles the guildMemberRemove event. Constructs an embed and passes it to the
 * welcome channel. Logs the roles the member had on Discord.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember | PartialGuildMember} member An object representing the user who left the server.
 */
export const memberRemove = async (
  Becca: BeccaLyria,
  member: GuildMember | PartialGuildMember
): Promise<void> => {
  try {
    const { user, guild, nickname, roles, pending } = member;

    if (!user) {
      return;
    }

    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const roleList = roles.cache.map((el) => el);

    const serverConfig = await Becca.db.servers.findUnique({
      where: { serverID: guild.id },
    });
    const messageCount = await Becca.db.messagecounts.findUnique({
      where: {
        serverId_userId: {
          serverId: guild.id,
          userId: user.id,
        },
      },
    });

    const goodbyeEmbed = new EmbedBuilder();
    goodbyeEmbed.setTitle(t("events:member.leave.title"));
    goodbyeEmbed.setColor(Becca.colours.default);
    goodbyeEmbed.setDescription(
      (serverConfig?.leave_message || defaultServer.leave_message)
        .replace(/\{@username\}/g, `<@!${member.id}>`)
        .replace(/\{@servername\}/g, guild.name)
    );
    goodbyeEmbed.addFields([
      {
        name: t("events:member.leave.name"),
        value: nickname || user.username,
      },
      {
        name: t("events:member.leave.roles"),
        value: roleList.join("\n"),
      },
      {
        name: t("events:member.leave.count"),
        value: String(messageCount?.messages || 0),
      },
    ]);
    goodbyeEmbed.setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    });
    goodbyeEmbed.setFooter({ text: `ID: ${user.id}` });
    goodbyeEmbed.setTimestamp();

    pending
      ? await sendLogEmbed(Becca, guild, goodbyeEmbed, "member_events")
      : await sendWelcomeEmbed(Becca, guild, "leave", goodbyeEmbed);

    await memberRemoveCleanup(Becca, member.id, guild.id);
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member remove event",
      err,
      member.guild.name
    );
  }
};
