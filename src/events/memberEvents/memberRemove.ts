import { GuildMember, MessageEmbed, PartialGuildMember } from "discord.js";
import { getFixedT } from "i18next";

import { defaultServer } from "../../config/database/defaultServer";
import ServerModel from "../../database/models/ServerConfigModel";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { memberRemoveCleanup } from "../../modules/guild/memberRemoveCleanup";
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
    const { user, guild, nickname, roles } = member;

    if (!user) {
      return;
    }

    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const roleList = roles.cache.map((el) => el);

    const serverConfig = await ServerModel.findOne({ serverID: guild.id });

    const goodbyeEmbed = new MessageEmbed();
    goodbyeEmbed.setTitle(t("events:member.leave.title"));
    goodbyeEmbed.setColor(Becca.colours.default);
    goodbyeEmbed.setDescription(
      (serverConfig?.leave_message || defaultServer.leave_message)
        .replace(/\{@username\}/g, `<@!${member.id}>`)
        .replace(/\{@servername\}/g, guild.name)
    );
    goodbyeEmbed.addField(
      t("events:member.leave.name"),
      nickname || user.username
    );
    goodbyeEmbed.addField(t("events:member.leave.roles"), roleList.join("\n"));
    goodbyeEmbed.setAuthor({
      name: user.tag,
      iconURL: user.displayAvatarURL(),
    });
    goodbyeEmbed.setFooter(`ID: ${user.id}`);
    goodbyeEmbed.setTimestamp();

    await sendWelcomeEmbed(Becca, guild, "leave", goodbyeEmbed);
    await memberRemoveCleanup(Becca, member.id, guild.id);

    Becca.pm2.metrics.users.set(Becca.pm2.metrics.users.val() - 1);
    Becca.pm2.metrics.events.mark();
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member remove event",
      err,
      member.guild.name
    );
  }
};
