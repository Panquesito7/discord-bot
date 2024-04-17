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
    .setName("automod_channels")
    .setDescription("Add or remove a channel from automod.")
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
    .setName("no_automod_channels")
    .setDescription("Add or remove a channel from automod's ignore list.")
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
    .setName("automod_roles")
    .setDescription("Add or remove a role from the automod exemption list.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to edit.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("allowed_links")
    .setDescription("Add or remove a regex to test for allowed links.")
    .addStringOption((option) =>
      option
        .setName("regex")
        .setDescription("The regex to match against links")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("link_message")
    .setDescription("Set a custom message to be sent when a link is deleted.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("profanity_message")
    .setDescription(
      "Set a custom message to be sent when profanity is deleted."
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
    ),
  new SlashCommandSubcommandBuilder()
    .setName("antiphish")
    .setDescription("Set the action to take when a phishing link is detected.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send.")
        .setRequired(true)
        .addChoices(
          { name: "Do nothing when a scam link is detected.", value: "none" },
          { name: "Mute the user for 24 hours.", value: "mute" },
          { name: "Kick the user.", value: "kick" },
          { name: "Ban the user.", value: "ban" }
        )
    ),
  new SlashCommandSubcommandBuilder()
    .setName("links")
    .setDescription("Toggle Link Detection")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Enable/Disable the setting.")
        .setRequired(true)
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
    ),
  new SlashCommandSubcommandBuilder()
    .setName("profanity")
    .setDescription("Toggle Profanity Detection")
    .addStringOption((option) =>
      option
        .setName("toggle")
        .setDescription("Enable/Disable the setting.")
        .setRequired(true)
        .addChoices({ name: "on", value: "on" }, { name: "off", value: "off" })
    ),
];

export const automod: Command = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Manages the automod config")
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
      const value = `${
        interaction.options.get(subcommandData.options[0].name)?.value ??
        defaultServer[setting]
      }`;
      const handler = handlers[action];
      await handler(Becca, interaction, t, config, setting, value);
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "automod group command",
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
