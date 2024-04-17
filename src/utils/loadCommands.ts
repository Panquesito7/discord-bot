import { readdir, stat } from "fs/promises";
import { join } from "path";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { Command } from "../interfaces/commands/Command";

import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads the `/commands` directory and dynamically imports the files,
 * then pushes the imported data to an array. Mounts the array to Becca.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {boolean} If commands were successfully loaded and mounted.
 */
export const loadCommands = async (Becca: BeccaLyria): Promise<boolean> => {
  try {
    const result: Command[] = [];
    const files = await readdir(
      join(process.cwd(), "prod", "commands"),
      "utf-8"
    );
    for (const file of files) {
      const status = await stat(join(process.cwd(), "prod", "commands", file));
      if (status.isDirectory()) {
        continue;
      }
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd(), "prod", "commands", file));
      result.push(mod[name] as Command);
    }
    Becca.commands = result;
    return result.length > 0;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return false;
  }
};
