import { EmbedBuilder, ThreadChannel } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Logs the deletion of a thread.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ThreadChannel} thread Channel object representing the deleted thread.
 */
export const threadDelete = async (
  Becca: BeccaLyria,
  thread: ThreadChannel
): Promise<void> => {
  try {
    const lang = thread.guild.preferredLocale;
    const t = getFixedT(lang);
    const threadEmbed = new EmbedBuilder();
    threadEmbed.setTitle(t("events:thread.delete.title"));
    threadEmbed.setDescription(
      t("events:thread.delete.desc", {
        name: thread.name,
        parentName: thread.parent?.name,
      })
    );
    threadEmbed.setColor(Becca.colours.error);
    threadEmbed.setFooter({ text: `ID: ${thread.id}` });
    threadEmbed.setTimestamp();

    await sendLogEmbed(Becca, thread.guild, threadEmbed, "thread_events");
  } catch (err) {
    await beccaErrorHandler(Becca, "thread delete event", err);
  }
};
