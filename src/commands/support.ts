import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleDataRequest } from "./subcommands/support/handleDataRequest";
import { handleIds } from "./subcommands/support/handleIds";
import { handleLogs } from "./subcommands/support/handleLogs";
import { handleServer } from "./subcommands/support/handleServer";

const handlers: { [key: string]: CommandHandler } = {
  server: handleServer,
  logs: handleLogs,
  ids: handleIds,
  "data-request": handleDataRequest,
};

export const support: Command = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Commands related to support.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("logs")
        .setDescription("Query the debug logs for a specific guild ID.")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the guild to look for in the logs.")
            .setRequired(true)
            .setMinLength(16)
            .setMaxLength(19)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("server")
        .setDescription("Get the invite link for the support server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ids")
        .setDescription("Get your id, the channel id, and the guild id")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("data-request")
        .setDescription("Fetch your data from Becca's database.")
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });

      const subCommand = interaction.options.getSubcommand();
      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "code group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "support group", errorId, t)],
      });
    }
  },
};
