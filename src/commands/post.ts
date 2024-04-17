import {
  ChannelType,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleCreate } from "./subcommands/post/handleCreate";
import { handleDelete } from "./subcommands/post/handleDelete";
import { handleEdit } from "./subcommands/post/handleEdit";

const handlers: { [key: string]: CommandHandler } = {
  create: handleCreate,
  edit: handleEdit,
  delete: handleDelete,
};

export const post: Command = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Commands for managing server posts.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Command to create server post.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to send this message in.")
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
              ChannelType.AnnouncementThread,
              ChannelType.PublicThread,
              ChannelType.PrivateThread
            )
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("edit")
        .setDescription("Command to edit server posts.")
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription("Link to the post that you want to edit.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("delete")
        .setDescription("Command to delete a server post.")
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription("Link to the post that you want to edit.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      const subCommand = interaction.options.getSubcommand();
      const handler = handlers[subCommand] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "post group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "post group", errorId, t)],
      });
    }
  },
};
