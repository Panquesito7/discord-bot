import { servers } from "@prisma/client";
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ValidatedChatInputCommandInteraction } from "../discord/ValidatedChatInputCommandInteraction";

export interface Command {
  data:
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    | SlashCommandSubcommandsOnlyBuilder;
  /**
   * Handles the logic for running a given command.
   *
   * @param {BeccaLyria} Becca Becca's Discord instance.
   * @param {ValidatedChatInputCommandInteraction} interaction The interaction payload from Discord.
   * @param {TFunction} t The i18n translation function.
   * @param {servers} config The server configuration from the database.
   */
  run: (
    Becca: BeccaLyria,
    interaction: ValidatedChatInputCommandInteraction,
    t: TFunction,
    config: servers
  ) => Promise<void>;
}
