import { SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const currency: Command = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Handles Becca's economy system.")
    .setDMPermission(false),
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply();

      await interaction.editReply({
        content:
          "Becca's currency system has been retired. Thanks for playing!",
      });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "currency group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "currency group", errorId, t)],
      });
    }
  },
};
