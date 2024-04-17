import { writeFile } from "fs/promises";
import { join } from "path";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Creates the initial ticket log file.
 *
 * @param {BeccaLyria} Becca The bot's Discord instance.
 * @param {string} guildId The ticket channel's guild ID.
 * @param {string} channelId The ticket channel ID, used as a unique identifier.
 */
export const createLogFile = async (
  Becca: BeccaLyria,
  guildId: string,
  channelId: string
): Promise<void> => {
  try {
    await writeFile(
      join(process.cwd(), "logs", `${guildId}-${channelId}.txt`),
      `[${new Date().toLocaleString()}] - **TICKET CREATED**\n`
    );
  } catch (err) {
    await beccaErrorHandler(Becca, "log file creation", err);
  }
};
