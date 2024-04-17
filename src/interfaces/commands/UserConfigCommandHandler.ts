import { userconfigs } from "@prisma/client";
import { ChatInputCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function (generated in the command def).
 * @param {userconfigs} config The settings for the user who called the interaction.
 */
export type UserConfigCommandHandler = (
  Becca: BeccaLyria,
  interaction: ChatInputCommandInteraction,
  t: TFunction,
  config: userconfigs
) => Promise<void>;
