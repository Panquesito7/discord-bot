import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { UserConfigCommandHandler } from "../interfaces/commands/UserConfigCommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleLevelCard } from "./subcommands/userconfig/handleLevelCard";
import { handleUserConfigView } from "./subcommands/userconfig/handleUserConfigView";

const handlers: { [key: string]: UserConfigCommandHandler } = {
  view: handleUserConfigView,
  levelcard: handleLevelCard,
};

export const userConfig: Command = {
  data: new SlashCommandBuilder()
    .setName("userconfig")
    .setDescription("Manage your personal bot settings.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your personal bot settings.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("levelcard")
        .setDescription("Customise your level card")
        .addStringOption((option) =>
          option
            .setName("background")
            .setDescription("The background colour for your card.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("foreground")
            .setDescription("The foreground colour for your card.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("progress")
            .setDescription("The colour of your progress bar.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply();
      const { user } = interaction;
      const subcommand = interaction.options.getSubcommand();

      const userConfig = await Becca.db.userconfigs.upsert({
        where: {
          userId: user.id,
        },
        update: {},
        create: {
          userId: user.id,
          levelcard: {
            background: "#3a3240",
            foreground: "#aea8de",
            progress: "#ffffff",
          },
        },
      });

      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, userConfig);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "userconfig command group",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "userconfig group", errorId, t)],
      });
    }
  },
};
