import { EmbedBuilder, ThreadChannel } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * When a new thread is created, logs it to the log channel and joins
 * the thread automatically, to ensure Becca is available for all needs.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ThreadChannel} thread The channel object representing the new thread.
 */
export const threadCreate = async (
  Becca: BeccaLyria,
  thread: ThreadChannel
): Promise<void> => {
  try {
    if (thread.joinable) {
      await thread.join();
    }

    const lang = thread.guild.preferredLocale;
    const t = getFixedT(lang);

    const threadEmbed = new EmbedBuilder();

    threadEmbed.setTitle(t("events:thread.create.title"));
    threadEmbed.setDescription(
      t("events:thread.create.desc", { id: `<#${thread.id}>` })
    );
    threadEmbed.setColor(Becca.colours.success);
    threadEmbed.setTimestamp();
    threadEmbed.setFooter({ text: `ID: ${thread.id}` });

    await sendLogEmbed(Becca, thread.guild, threadEmbed, "thread_events");
  } catch (err) {
    await beccaErrorHandler(Becca, "thread create event", err);
  }
};
