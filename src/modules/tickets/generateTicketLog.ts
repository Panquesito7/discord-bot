import { readFile, unlink } from "fs/promises";
import { join } from "path";

import { AttachmentBuilder } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * To run when a ticket is closed. Finds the ticket log file,
 * creates a message attachement with the logs, and deletes the file.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} guildId The ID of the guild the ticket was opened in.
 * @param {string} channelId The ID of the ticket channel.
 * @returns {AttachmentBuilder} The ticket log as a Discord attachment.
 */
export const generateLogs = async (
  Becca: BeccaLyria,
  guildId: string,
  channelId: string
): Promise<AttachmentBuilder> => {
  try {
    const logs = await readFile(
      join(process.cwd(), "logs", `${guildId}-${channelId}.txt`),
      "utf8"
    ).catch(() => "no logs found...");

    const attachment = new AttachmentBuilder(Buffer.from(logs, "utf-8"), {
      name: "log.txt",
    });

    await unlink(join(process.cwd(), "logs", `${guildId}-${channelId}.txt`));

    return attachment;
  } catch (err) {
    await beccaErrorHandler(Becca, "log generator", err);
    return new AttachmentBuilder(
      Buffer.from("An error occurred fetching these logs.", "utf-8"),
      { name: "log.txt" }
    );
  }
};
