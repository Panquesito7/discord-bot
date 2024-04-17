import {
  GuildMember,
  EmbedBuilder,
  PartialGuildMember,
  PermissionFlagsBits,
} from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { memberNicknameChange } from "../../modules/events/memberUpdate/memberNicknameChange";
import { memberPassedScreening } from "../../modules/events/memberUpdate/memberPassedScreening";
import { memberRolesChange } from "../../modules/events/memberUpdate/memberRolesChange";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * Handles the memberUpdate event. Currently checks to see if
 * member has passed screening event, and if so, sends welcome embed.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember | PartialGuildMember} oldMember The member's state before the update.
 * @param {GuildMember} newMember The member's state after the update.
 */
export const memberUpdate = async (
  Becca: BeccaLyria,
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember
): Promise<void> => {
  try {
    const { guild, user } = newMember;
    const lang = guild.preferredLocale;
    const t = getFixedT(lang);
    const serverSettings = await getSettings(Becca, guild.id, guild.name);

    if (!serverSettings) {
      return;
    }

    // passes membership screening
    if (oldMember.pending && !newMember.pending) {
      await memberPassedScreening(Becca, newMember, serverSettings, t);
    }

    if (!serverSettings.member_events) {
      return;
    }

    const logChannel = await FetchWrapper.channel(
      guild,
      serverSettings.member_events
    );
    const beccaMember = await FetchWrapper.becca(Becca, guild);

    if (
      !logChannel?.isTextBased() ||
      !beccaMember
        ?.permissionsIn(logChannel)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      return;
    }

    const embed = new EmbedBuilder();
    embed.setColor(Becca.colours.default);
    embed.setTitle(t("events:member.update.title"));
    embed.setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    });
    embed.setFooter({ text: `ID: ${user.id}` });
    embed.setTimestamp();

    if (oldMember.nickname !== newMember.nickname) {
      await memberNicknameChange(
        Becca,
        oldMember,
        newMember,
        embed,
        t,
        logChannel
      );
    }

    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
      await memberRolesChange(
        Becca,
        oldMember,
        newMember,
        embed,
        t,
        logChannel
      );
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member update event",
      err,
      newMember.guild.name
    );
  }
};
