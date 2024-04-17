import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";

import { emoteChoices } from "../config/commands/emoteData";
import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { getOptOutRecord } from "../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleEmoteUse } from "./subcommands/emote/handleEmoteUse";
import { handleEmoteView } from "./subcommands/emote/handleEmoteView";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  use: handleEmoteUse,
  view: handleEmoteView,
};

export const emote: Command = {
  data: new SlashCommandBuilder()
    .setName("emote")
    .setDescription("Emote commands!")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("use")
        .setDescription("Use an emote on someone!")
        .addStringOption((option) =>
          option
            .setName("emote")
            .setRequired(true)
            .setDescription("The emote to use.")
            .addChoices(...emoteChoices)
        )
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to target with your emote.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription(
          "View the number of times you have been the target of an emote."
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();

      const optout = await getOptOutRecord(Becca, interaction.user.id);

      if (!optout || optout.emote) {
        return;
      }

      const subcommand = interaction.options.getSubcommand();
      const handler = handlers[subcommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "emote group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "emote group", errorId, t)],
      });
    }
  },
};
