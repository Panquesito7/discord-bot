import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

import { defaultServer } from "../config/database/defaultServer";
import { Command } from "../interfaces/commands/Command";
import { Settings } from "../interfaces/settings/Settings";
import { SettingsHandler } from "../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { attachSubcommandsToGroup } from "../utils/attachSubcommands";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../utils/tFunctionWrapper";

import { handleReset } from "./subcommands/config/handleReset";
import { handleSet } from "./subcommands/config/handleSet";
import { handleView } from "./subcommands/config/handleView";
import { handleInvalidSubcommand } from "./subcommands/handleInvalidSubcommand";

const handlers: { [key: string]: SettingsHandler } = {
  set: handleSet,
  reset: handleReset,
  view: handleView,
};

const subcommands = [
  new SlashCommandSubcommandBuilder()
    .setName("levels")
    .setDescription("Turn the level system on or off.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Turn levels on or off.")
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_channel")
    .setDescription("Set where level + role messages should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_roles")
    .setDescription("Add or remove a level-based role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to edit.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("level")
        .setDescription("The level to assign the role.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_style")
    .setDescription("Set the style of level/role messages.")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("The style to use.")
        .addChoices(
          { name: "text", value: "text" },
          { name: "embed", value: "embed" }
        )
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_message")
    .setDescription("Set a custom message to be sent when someone levels up.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("role_message")
    .setDescription(
      "Set a custom message to be sent when someone earns a level role."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("initial_xp")
    .setDescription("Set a value for how much XP a user starts with.")
    .addIntegerOption((option) =>
      option
        .setName("points")
        .setDescription("The XP to award when someone joins.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_ignore")
    .setDescription("Add or remove a channel from the levels ignore list.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to edit.")
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.PublicThread,
          ChannelType.GuildForum,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("level_decay")
    .setDescription(
      "Set the percentage at which experience should reduce every day."
    )
    .addNumberOption((option) =>
      option
        .setName("percent")
        .setDescription("The daily decay percentage.")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
];

export const levels: Command = {
  data: new SlashCommandBuilder()
    .setName("levels")
    .setDescription("Manages the level system for the server.")
    .setDMPermission(false)
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("set")
          .setDescription("Set a specific automod setting."),
        subcommands
      )
    )
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("reset")
          .setDescription("Clear the value of a specific setting."),
        subcommands,
        true
      )
    )
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("view")
          .setDescription("View your automod settings."),
        subcommands,
        true
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

      const action = interaction.options.getSubcommandGroup(true);
      const setting = interaction.options.getSubcommand(true) as Settings;
      const subcommandData = subcommands.find((el) => el.name === setting);
      if (!subcommandData) {
        await handleInvalidSubcommand(Becca, interaction, t, config);
        return;
      }
      const value =
        setting === "level_roles"
          ? `${interaction.options.getInteger("level", true)} ${
              interaction.options.getRole("role", true).id
            }`
          : `${
              interaction.options.get(subcommandData.options[0].name)?.value ??
              defaultServer[setting]
            }`;
      const handler = handlers[action];
      await handler(Becca, interaction, t, config, setting, value);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "welcome group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "automod group", errorId, t)],
      });
    }
  },
};
