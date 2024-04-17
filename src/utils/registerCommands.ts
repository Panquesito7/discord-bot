import {
  Message,
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";

import { BeccaLyria } from "../interfaces/BeccaLyria";

import { beccaErrorHandler } from "./beccaErrorHandler";
import { beccaLogHandler } from "./beccaLogHandler";

/**
 * Takes both the commands and contexts, parses the `data` properties as needed,
 * and builds an array of all command data. Then, posts the data to the Discord endpoint
 * for registering commands.
 *
 * Will register commands globally if in a production environment, otherwise defaults to the
 * home guild only.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Message} message The message that triggered the command.
 * @returns {boolean} True if the commands were registered, false on error.
 */
export const registerCommands = async (
  Becca: BeccaLyria,
  message?: Message
): Promise<boolean> => {
  try {
    const rest = new REST({ version: "10" }).setToken(Becca.configs.token);

    const commandData: (
      | RESTPostAPIApplicationCommandsJSONBody
      | RESTPostAPIChatInputApplicationCommandsJSONBody
    )[] = [];

    Becca.commands.forEach((command) => {
      const data =
        command.data.toJSON() as RESTPostAPIApplicationCommandsJSONBody;
      data.options?.sort((a, b) => a.name.localeCompare(b.name));

      commandData.push(data);
    });
    Becca.contexts.forEach((context) => commandData.push(context.data));
    if (process.env.NODE_ENV === "production") {
      beccaLogHandler.log("debug", "registering commands globally!");
      await rest.put(Routes.applicationCommands(Becca.configs.id), {
        body: commandData,
      });
      if (message) {
        await message.channel.send({
          content: "Commands registered globally!",
        });
      }
    } else {
      beccaLogHandler.log("debug", "registering to home guild only");
      await rest.put(
        Routes.applicationGuildCommands(
          Becca.configs.id,
          Becca.configs.homeGuild
        ),
        { body: commandData }
      );
      if (message) {
        await message.channel.send({
          content: `Commands registered to guild ${Becca.configs.homeGuild}!`,
        });
      }
    }
    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command register", err);
    return false;
  }
};
