import { Message } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { registerCommands } from "../../utils/registerCommands";
import { naomiAntiphish } from "../naomi/naomiAntiphish";
import { naomiMee6 } from "../naomi/naomiMee6";
import { naomiMigrate } from "../naomi/naomiMigrate";
import { naomiPurgeData } from "../naomi/naomiPurgeData";
import { naomiTopgg } from "../naomi/naomiTopgg";
import { naomiUnregisterCommand } from "../naomi/naomiUnregisterCommand";
import { naomiViewCommands } from "../naomi/naomiViewCommands";

/**
 * Wrapper to handle the owner-only Naomi commands.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Message} message The message object from Discord.
 */
export const runNaomiCommands = async (Becca: BeccaLyria, message: Message) => {
  await message.reply("Heya, Naomi!");
  // Naomi <command> <...stuff>
  const [, command] = message.content.split(" ");

  switch (command) {
    case "register":
      await registerCommands(Becca, message);
      break;
    case "unregister":
      await naomiUnregisterCommand(Becca, message);
      break;
    case "view":
      await naomiViewCommands(Becca, message);
      break;
    case "purge":
      await naomiPurgeData(Becca, message);
      break;
    case "fish":
      await naomiAntiphish(Becca, message);
      break;
    case "Mee6":
      await naomiMee6(Becca, message);
      break;
    case "topgg":
      await naomiTopgg(Becca, message);
      break;
    case "migrate":
      await naomiMigrate(Becca, message);
      break;
    default:
      await message.reply("Hope you are well!");
  }
};
