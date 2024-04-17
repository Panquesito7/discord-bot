import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleCanIUse } from "./subcommands/code/handleCanIUse";
import { handleColour } from "./subcommands/code/handleColour";
import { handleHttp } from "./subcommands/code/handleHttp";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  caniuse: handleCanIUse,
  colour: handleColour,
  http: handleHttp,
};

export const code: Command = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Commands related to programming.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("caniuse")
        .setDescription(
          "Returns browser support information for a given feature."
        )
        .addStringOption((option) =>
          option
            .setName("feature")
            .setDescription("The HTML/CSS/JS feature to look up.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("colour")
        .setDescription("Returns an embed showing the colour.")
        .addStringOption((option) =>
          option
            .setName("hex")
            .setDescription("The six digit hex code to display.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("http")
        .setDescription(
          "Shows a cat demonstrating the provided http status code."
        )
        .addIntegerOption((option) =>
          option
            .setName("status")
            .setDescription("The status code to check.")
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
        "code group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "code group", errorId, t)],
      });
    }
  },
};
