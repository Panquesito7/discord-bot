import { readFile, writeFile } from "fs/promises";
import { join } from "path";

import { Message } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Logs a ticket message.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} guildId The ticket's guild ID.
 * @param {string} channelId The ticket's channel ID.
 * @param {Message} message The message sent in the ticket.
 */
export const logTicketMessage = async (
  Becca: BeccaLyria,
  guildId: string,
  channelId: string,
  message: Message
): Promise<void> => {
  try {
    const logFile = await readFile(
      join(process.cwd(), "logs", `${guildId}-${channelId}.txt`),
      "utf8"
    );

    const parsedString = `[${new Date(
      message.createdTimestamp
    ).toLocaleString()}] - ${message.author.tag}: ${message.content}\n`;

    await writeFile(
      join(process.cwd(), "logs", `${guildId}-${channelId}.txt`),
      logFile + parsedString
    );
  } catch (err) {
    await beccaErrorHandler(Becca, "message logger", err);
  }
};
