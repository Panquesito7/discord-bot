import { Message } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner-only module to view the current list of commands.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiMigrate = async (Becca: BeccaLyria, message: Message) => {
  try {
    // "~Naomi migrate X"
    const [, , command] = message.content.split(" ");

    await message.reply(`No migration found for ${command}.`);
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "migrate command",
      err,
      message.guild?.name,
      message
    );
    await message.reply("Migration failed!");
  }
};
