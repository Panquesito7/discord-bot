import {
  AuditLogEvent,
  EmbedBuilder,
  Guild,
  GuildAuditLogsEntry,
} from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { updateHistory } from "../../modules/commands/moderation/updateHistory";
import { getModActionFromAuditLog } from "../../modules/events/getModActionFromAuditLog";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * Handles the audit log entry create event.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildAuditLogsEntry} auditLogEntry The audit log entry payload.
 * @param {Guild} guild The guild teh event was triggered in.
 */
export const guildAuditLogEntryCreate = async (
  Becca: BeccaLyria,
  auditLogEntry: GuildAuditLogsEntry,
  guild: Guild
): Promise<void> => {
  try {
    const { action, changes, executorId, targetId } = auditLogEntry;
    if (executorId === Becca.user?.id) {
      return;
    }

    // if not a mod action we don't care.
    if (
      ![
        AuditLogEvent.MemberBanAdd,
        AuditLogEvent.MemberBanRemove,
        AuditLogEvent.MemberKick,
        AuditLogEvent.MemberUpdate,
      ].includes(action) ||
      (action === AuditLogEvent.MemberUpdate &&
        !changes.find(
          (change) => change.key === "communication_disabled_until"
        )) ||
      !targetId
    ) {
      return;
    }

    const modAction = getModActionFromAuditLog(auditLogEntry);

    if (!modAction) {
      return;
    }

    await updateHistory(Becca, modAction, targetId, guild.id);

    const settings = await getSettings(Becca, guild.id, guild.name);

    if (!settings?.moderation_events) {
      return;
    }

    const channel = await FetchWrapper.channel(
      guild,
      settings.moderation_events
    );

    if (!channel?.isTextBased()) {
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle(`Manual ${modAction} detected`);
    embed.setDescription(
      `The user <@!${targetId}>'s history has been updated. For detailed logs, please use my \`/mod\` commands to action users.`
    );
    embed.addFields(
      {
        name: "Moderator",
        value: `<@!${executorId}>`,
      },
      {
        name: "Reason",
        value: auditLogEntry.reason || "No reason provided.",
      }
    );
    await channel.send({ embeds: [embed] });
  } catch (err) {
    await beccaErrorHandler(Becca, "guild audit log entry create event", err);
  }
};
