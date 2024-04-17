import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

import { Command } from "../interfaces/commands/Command";
import { CommandHandler } from "../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../utils/tFunctionWrapper";

import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";
import { handleAdd } from "./subcommands/reactionrole/handleAdd";
import { handleCreate } from "./subcommands/reactionrole/handleCreate";
import { handleRemove } from "./subcommands/reactionrole/handleRemove";

const handlers: { [key: string]: CommandHandler } = {
  create: handleCreate,
  add: handleAdd,
  remove: handleRemove,
};

export const reactionRole: Command = {
  data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Commands for managing reaction roles.")
    .setDMPermission(false)
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("create")
        .setDescription("Create a new post with role buttons")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to create the post in.")
            .setRequired(true)
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
              ChannelType.PublicThread,
              ChannelType.GuildForum
            )
        )
        .addStringOption((option) =>
          option
            .setName("header")
            .setDescription("Text to include at the top of the post.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role1")
            .setDescription("Role to create a button for.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option.setName("role2").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role3").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role4").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role5").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role6").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role7").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role8").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option.setName("role9").setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role10")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role11")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role12")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role13")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role14")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role15")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role16")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role17")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role18")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role19")
            .setDescription("Role to create a button for.")
        )
        .addRoleOption((option) =>
          option
            .setName("role20")
            .setDescription("Role to create a button for.")
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("add")
        .setDescription("Adds a reaction role to an existing post.")
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription(
              "The link to the reaction role message you want to add a role to."
            )
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add to the reaction role post.")
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Removes a reaction role from an existing post.")
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription(
              "The link to the reaction role message you want to remove a role from."
            )
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove from the reaction role post.")
            .setRequired(true)
        )
    ),
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply();
      const { member } = interaction;

      if (
        !member.permissions.has(PermissionFlagsBits.ManageGuild) &&
        member.user.id !== Becca.configs.ownerId
      ) {
        await interaction.editReply({
          content: tFunctionArrayWrapper(t, "responses:noPermission"),
        });
        return;
      }

      const action = interaction.options.getSubcommand();
      const handler = handlers[action] || handleInvalidSubcommand;
      await handler(Becca, interaction, t, config);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "reaction role command group",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "reaction role group", errorId, t)],
      });
    }
  },
};
