import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  ChannelType,
  PermissionFlagsBits,
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
    .setName("message_events")
    .setDescription("Set where message edits/deletes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("voice_events")
    .setDescription("Set where voice chat leaves/joins/mutes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("thread_events")
    .setDescription("Set where thread create/deletes should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("member_events")
    .setDescription("Set where member updates should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("moderation_events")
    .setDescription("Set where moderation actions should be logged.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to log.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText, ChannelType.PublicThread)
    ),
];

export const log: Command = {
  data: new SlashCommandBuilder()
    .setName("log")
    .setDescription("Manages the logging config.")
    .setDMPermission(false)
    .addSubcommandGroup(
      attachSubcommandsToGroup(
        new SlashCommandSubcommandGroupBuilder()
          .setName("set")
          .setDescription("Set a specific log setting."),
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
          .setDescription("View your logging settings."),
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
      const value = `${
        interaction.options.get(subcommandData.options[0].name)?.value ??
        defaultServer[setting]
      }`;
      const handler = handlers[action];
      await handler(Becca, interaction, t, config, setting, value);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "log group command",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "log group", errorId, t)],
      });
    }
  },
};
