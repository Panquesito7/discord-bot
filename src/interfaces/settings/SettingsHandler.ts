import { servers } from "@prisma/client";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ValidatedChatInputCommandInteraction } from "../discord/ValidatedChatInputCommandInteraction";

import { Settings } from "./Settings";

/**
 * Handles the logic execution for a sub-command.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ValidatedChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function (generated in the command def).
 * @param {servers} config The settings for the server where the interaction occurred.
 * @param {Settings} settings The settings for the server where the interaction occurred.
 * @param {string} setting The setting to view.
 */
export type SettingsHandler = (
  Becca: BeccaLyria,
  interaction: ValidatedChatInputCommandInteraction,
  t: TFunction,
  config: servers,
  setting: Settings,
  value: string
) => Promise<void>;
