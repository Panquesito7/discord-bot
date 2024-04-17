import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleEcho } from "./subcommands/misc/handleEcho";
import { handleLanguage } from "./subcommands/misc/handleLanguage";
import { handleLevelscale } from "./subcommands/misc/handleLevelscale";
import { handlePermissions } from "./subcommands/misc/handlePermissions";
import { handleSpace } from "./subcommands/misc/handleSpace";
import { handleUsername } from "./subcommands/misc/handleUsername";
import { handleXkcd } from "./subcommands/misc/handleXkcd";

const handlers: { [key: string]: CommandHandler } = {
  space: handleSpace,
  username: handleUsername,
  xkcd: handleXkcd,
  permissions: handlePermissions,
  levelscale: handleLevelscale,
  language: handleLanguage,
  echo: handleEcho,
};

const ephemerals = ["echo"];

export const misc: Command = {
  data: new SlashCommandBuilder()
    .setName("misc")
    .setDescription("Miscellaneous commands that do not fit other categories")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("space")
        .setDescription("Returns the NASA Astronomy Photo of the Day")
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription("Date of the photo to fetch, in YYYY-MM-DD format.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("echo")
        .setDescription(
          "Tell Becca to send a specific message in this channel."
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message you want Becca to send.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("username")
        .setDescription("Generates a DigitalOcean themed username.")
        .addIntegerOption((option) =>
          option
            .setName("length")
            .setDescription("Maximum length of the username to generate.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("xkcd")
        .setDescription(
          "Returns the latest XKCD comic, or the specific numbered comic."
        )
        .addIntegerOption((option) =>
          option
            .setName("number")
            .setDescription("Number of the XKCD comic to fetch.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("permissions")
        .setDescription(
          "Confirms the bot has the correct permissions in the channel and guild."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("levelscale")
        .setDescription(
          "Returns a map of the level scale used by Becca's levelling system"
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("language")
        .setDescription(
          "Provides your configured language information (in Discord)."
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply({
        ephemeral: ephemerals.includes(interaction.options.getSubcommand()),
      });

      const subCommand = interaction.options.getSubcommand();
      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "misc group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "misc group", errorId, t)],
      });
    }
  },
};
