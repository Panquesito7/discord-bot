import { ChatInputCommandInteraction } from "discord.js";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Tracks anonymous slash command usage to see which are popular
 * and which are unused.
 */
export const usageListener = {
  name: "usage",
  description: "Tracks command usage.",
  run: async (
    Becca: BeccaLyria,
    interaction: ChatInputCommandInteraction
  ): Promise<void> => {
    try {
      const command = interaction.commandName;
      const subcommand =
        interaction.options.getSubcommand(false) || "no subcommand";

      await Becca.db.usages.upsert({
        where: {
          command_subcommand: {
            command,
            subcommand,
          },
        },
        update: {
          uses: {
            increment: 1,
          },
        },
        create: {
          command,
          subcommand,
          uses: 0,
        },
      });
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "usage listener",
        err,
        interaction.guild?.name
      );
    }
  },
};
