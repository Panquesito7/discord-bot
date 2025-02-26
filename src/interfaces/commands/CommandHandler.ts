import { CommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ServerConfig } from "../database/ServerConfig";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {CommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function (generated in the command def).
 * @param {ServerConfig} config The settings for the server where the interaction occurred.
 */
export type CommandHandler = (
  Becca: BeccaLyria,
  interaction: CommandInteraction,
  t: TFunction,
  config: ServerConfig
) => Promise<void>;
