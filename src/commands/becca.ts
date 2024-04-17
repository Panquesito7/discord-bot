import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  ChannelType,
} from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleAbout } from "./subcommands/becca/handleAbout";
import { handleAdventure } from "./subcommands/becca/handleAdventure";
import { handleAnnouncements } from "./subcommands/becca/handleAnnouncements";
import { handleArt } from "./subcommands/becca/handleArt";
import { handleContact } from "./subcommands/becca/handleContact";
import { handleDonate } from "./subcommands/becca/handleDonate";
import { handleEmote } from "./subcommands/becca/handleEmote";
import { handleFeedback } from "./subcommands/becca/handleFeedback";
import { handleHelp } from "./subcommands/becca/handleHelp";
import { handleInvite } from "./subcommands/becca/handleInvite";
import { handlePing } from "./subcommands/becca/handlePing";
import { handlePrivacy } from "./subcommands/becca/handlePrivacy";
import { handleProfile } from "./subcommands/becca/handleProfile";
import { handleStats } from "./subcommands/becca/handleStats";
import { handleTranslators } from "./subcommands/becca/handleTranslators";
import { handleUpdates } from "./subcommands/becca/handleUpdates";
import { handleUptime } from "./subcommands/becca/handleUptime";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: CommandHandler } = {
  ping: handlePing,
  help: handleHelp,
  about: handleAbout,
  invite: handleInvite,
  art: handleArt,
  donate: handleDonate,
  uptime: handleUptime,
  profile: handleProfile,
  updates: handleUpdates,
  stats: handleStats,
  emote: handleEmote,
  adventure: handleAdventure,
  privacy: handlePrivacy,
  contact: handleContact,
  translators: handleTranslators,
  feedback: handleFeedback,
  announcements: handleAnnouncements,
};

export const becca: Command = {
  data: new SlashCommandBuilder()
    .setName("becca")
    .setDescription("Returns the uptime of the bot.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("ping")
        .setDescription("Returns the ping of the bot")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("help")
        .setDescription("Shows information on how to use the bot.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("about")
        .setDescription("Shows information about Becca.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("invite")
        .setDescription("Provides a link to invite Becca to your server.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("art")
        .setDescription("Returns an art of Becca!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("donate")
        .setDescription(
          "Gives instructions on how to support Becca's development financially."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("uptime")
        .setDescription("Shows how long Becca has been online.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("profile")
        .setDescription("Tells the story of Becca's character.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("updates")
        .setDescription(
          "Shows the latest updates to Becca, the next scheduled update, and additional details."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("stats")
        .setDescription("Shows bot statistics")
        .addStringOption((option) =>
          option
            .setName("view")
            .setDescription("Which stat do you want to view?")
            .addChoices(
              { name: "Bot Votes", value: "bvotes" },
              { name: "Server Votes", value: "svotes" }
            )
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("emote")
        .setDescription("Returns a Becca Emote!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("adventure")
        .setDescription("Returns an image from one of Becca's adventures!")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("privacy")
        .setDescription("Returns a link to Becca's privacy policy.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("contact")
        .setDescription("Offers links to contact the development team.")
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("translators")
        .setDescription(
          "Lists the wonderful people who have helped translate Becca."
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("feedback")
        .setDescription(
          "Provide feedback on Becca - request features, report bugs, or share your thoughts!"
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("announcements")
        .setDescription(
          "Subscribe to Becca's announcements directly in your server."
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel you want announcements posted in.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      const subCommand = interaction.options.getSubcommand();
      await interaction.deferReply();

      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "becca group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "becca group", errorId, t)],
      });
    }
  },
};
