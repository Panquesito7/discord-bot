import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleResetLevels } from "./subcommands/manage/handleResetLevels";
import { handleResetStars } from "./subcommands/manage/handleResetStars";
import { handleSuggestion } from "./subcommands/manage/handleSuggestion";
import { handleXpModify } from "./subcommands/manage/handleXpModify";

const handlers: { [key: string]: CommandHandler } = {
  resetlevels: handleResetLevels,
  resetstars: handleResetStars,
  suggestion: handleSuggestion,
  xpmodify: handleXpModify,
};

export const manage: Command = {
  data: new SlashCommandBuilder()
    .setName("manage")
    .setDescription("Commands for managing your server.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("resetlevels")
        .setDescription("Reset the leaderboard for your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("resetstars")
        .setDescription("Reset the star counts for your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("suggestion")
        .setDescription("Approve or deny a suggestion.")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("The action to take on the suggestion.")
            .addChoices(
              {
                name: "approve",
                value: "approve",
              },
              {
                name: "deny",
                value: "deny",
              }
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The message id of the suggestion to update.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for approving/denying the suggestion.")
            .setRequired(true)
            .setMaxLength(1024)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("xpmodify")
        .setDescription("Award or Remove experience.")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("The action you want to take with the xp.")
            .addChoices(
              {
                name: "add",
                value: "add",
              },
              {
                name: "remove",
                value: "remove",
              }
            )
            .setRequired(true)
        )
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to modify.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("adjustment")
            .setDescription("Amount to adjust the XP by.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      const subCommand = interaction.options.getSubcommand();
      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "manage group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "manage group", errorId, t)],
      });
    }
  },
};
