import { MessageEmbed, ThreadChannel } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Logs when a thread is unarchived or archived.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ThreadChannel} oldThread The thread state before the update.
 * @param {ThreadChannel} newThread The thread state after the update.
 */
export const threadUpdate = async (
  Becca: BeccaLyria,
  oldThread: ThreadChannel,
  newThread: ThreadChannel
): Promise<void> => {
  try {
    const lang = newThread.guild.preferredLocale;
    const t = getFixedT(lang);
    const threadEmbed = new MessageEmbed();
    threadEmbed.setFooter(`ID: ${oldThread.id}`);
    threadEmbed.setTimestamp();
    threadEmbed.setColor(Becca.colours.warning);

    if (!oldThread.archived && newThread.archived) {
      threadEmbed.setTitle(t("events:thread.archive.title"));
      threadEmbed.setDescription(
        t("events:thread.archive.desc", {
          name: newThread.name,
          parentName: newThread.parent?.name,
        })
      );
      await sendLogEmbed(Becca, newThread.guild, threadEmbed, "thread_events");
      return;
    }

    if (oldThread.archived && !newThread.archived) {
      threadEmbed.setTitle(t("events:thread.unarchive.title"));
      threadEmbed.setDescription(
        t("events:thread.unarchive.desc", {
          name: newThread.name,
          parentName: newThread.parent?.name,
        })
      );
      await sendLogEmbed(Becca, newThread.guild, threadEmbed, "thread_events");
      return;
    }
    Becca.pm2.metrics.events.mark();
  } catch (err) {
    await beccaErrorHandler(Becca, "thread update event", err);
  }
};
