/* eslint-disable jsdoc/require-jsdoc */
import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { handleBan } from "../modules/commands/subcommands/moderation/handleBan";
import { handleHistory } from "../modules/commands/subcommands/moderation/handleHistory";
import { handleKick } from "../modules/commands/subcommands/moderation/handleKick";
import { handleMute } from "../modules/commands/subcommands/moderation/handleMute";
import { handleUnmute } from "../modules/commands/subcommands/moderation/handleUnmute";
import { handleWarn } from "../modules/commands/subcommands/moderation/handleWarn";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { getRandomValue } from "../utils/getRandomValue";

export const mod: Command = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("Moderation actions")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("warn")
        .setDescription("Issues a warning to a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to warn.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for issuing this warning.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("mute")
        .setDescription("Mutes a user via your configured muted role.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to mute.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("The length of time to mute the user.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("unit")
            .setDescription("The unit of time for the duration.")
            .setRequired(true)
            .addChoices([
              ["Minutes", "minutes"],
              ["Hours", "hours"],
              ["Days", "days"],
              ["Weeks", "weeks"],
            ])
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for muting the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("unmute")
        .setDescription("Unmutes a user via your configured muted role.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to unmute.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for unmuting the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("kick")
        .setDescription("Kicks a user from the server.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to kick.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for kicking the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to kick.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("prune")
            .setDescription(
              "The number of days to clean up messages. Set to 0 to not clean messages."
            )
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(7)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for kicking the user.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("history")
        .setDescription("Views the moderation history of a user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to view the moderation history of.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();
      const subcommand = interaction.options.getSubcommand();

      switch (subcommand) {
        case "warn":
          await handleWarn(Becca, interaction, t, config);
          break;
        case "mute":
          await handleMute(Becca, interaction, t, config);
          break;
        case "unmute":
          await handleUnmute(Becca, interaction, t, config);
          break;
        case "kick":
          await handleKick(Becca, interaction, t, config);
          break;
        case "ban":
          await handleBan(Becca, interaction, t, config);
          break;
        case "history":
          await handleHistory(Becca, interaction, t, config);
          break;
        default:
          await interaction.editReply({
            content: getRandomValue(t("responses:invalidCommand")),
          });
          break;
      }
      Becca.pm2.metrics.commands.mark();
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "mod group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "mod group", errorId, t)],
      });
    }
  },
};
