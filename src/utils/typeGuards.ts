import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  ModalSubmitInteraction,
} from "discord.js";

import { EmoteAction } from "../config/commands/emoteData";
import { ModerationActions } from "../interfaces/commands/moderation/ModerationActions";
import { ValidatedButtonInteraction } from "../interfaces/discord/ValidatedButtonInteraction";
import { ValidatedChatInputCommandInteraction } from "../interfaces/discord/ValidatedChatInputCommandInteraction";
import { ValidatedContextMenuCommandInteraction } from "../interfaces/discord/ValidatedContextMenuCommand";
import { ValidatedMessage } from "../interfaces/discord/ValidatedMessage";
import { ValidatedModalSubmitInteraction } from "../interfaces/discord/ValidatedModalSubmitInteraction";
import {
  AntiphishSettings,
  ArrayOfChannelIdSettings,
  ArrayOfLevelRoleSettings,
  ArrayOfRoleIdSettings,
  ArrayOfStringSettings,
  ArrayOfTriggerSettings,
  ArrayOfUserIdSettings,
  ChannelIdSettings,
  NumberSettings,
  RoleIdSettings,
  StringSettings,
  StyleSettings,
} from "../interfaces/settings/Settings";

// ! Interaction Validation

/**
 * Confirms that the chat input interaction has a guild, member, and channel.
 *
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @returns {boolean} If the interaction has the necessary properties.
 */
export const chatInputCommandHasNecessaryProperties = (
  interaction: ChatInputCommandInteraction
): interaction is ValidatedChatInputCommandInteraction => {
  return (
    interaction.guild !== null &&
    interaction.member !== null &&
    interaction.guildId !== null &&
    interaction.channel !== null &&
    typeof interaction.member.permissions !== "string"
  );
};

/**
 * Confirms that the modal interaction has a guild.
 *
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 * @returns {boolean} If the interaction has the necessary properties.
 */
export const modalSubmitHasNecessaryProperties = (
  interaction: ModalSubmitInteraction
): interaction is ValidatedModalSubmitInteraction => {
  return interaction.guild !== null;
};

/**
 * Confirms that the context menu interaction has a guild and guildID.
 *
 * @param {ContextMenuCommandInteraction} interaction The interaction payload from Discord.
 * @returns {boolean} If the interaction has the necessary properties.
 */
export const contextCommandHasNecessaryProperties = (
  interaction: ContextMenuCommandInteraction
): interaction is ValidatedContextMenuCommandInteraction => {
  return interaction.guild !== null && interaction.guildId !== null;
};

/**
 * Confirms that button interaction has a guild.
 *
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 * @returns {boolean} If the interaction has the necessary properties.
 */
export const buttonInteractionHasNecessaryProperties = (
  interaction: ButtonInteraction
): interaction is ValidatedButtonInteraction => {
  return (
    interaction.guild !== null &&
    interaction.member !== null &&
    typeof interaction.member.permissions !== "string"
  );
};

/**
 * Confirms that a message has a guild and member.
 *
 * @param {Message} message The message payload from Discord.
 * @returns {boolean} If the message has the necessary properties.
 */
export const messageHasNecessaryProperties = (
  message: Message
): message is ValidatedMessage => {
  return (
    message.guild !== null &&
    message.member !== null &&
    typeof message.member.permissions !== "string"
  );
};

// ! Settings Validation

/**
 * Confirms that a string is a valid moderation action.
 *
 * @param {string} action The string to test.
 * @returns {boolean} If the string matches the ModerationActions type.
 */
export const isModerationAction = (
  action: string
): action is ModerationActions => {
  const actions: { [key in ModerationActions]: string } = {
    ban: "ban",
    kick: "kick",
    mute: "mute",
    unban: "unban",
    unmute: "unmute",
    warn: "warn",
  };
  return Object.keys(actions).includes(action);
};

/**
 * Confirms that az string is a valid emote action.
 *
 * @param {string} emote The string to test.
 * @returns {boolean} If the string matches the EmoteAction type.
 */
export const isEmoteAction = (emote: string): emote is EmoteAction => {
  const actions: { [key in EmoteAction]: string } = {
    hug: "hug",
    kiss: "kiss",
    smack: "smack",
    boop: "boop",
    throw: "throw",
    pat: "pat",
    uwu: "uwu",
  };
  return Object.keys(actions).includes(emote);
};

/**
 * Confirms that a string is a valid antiphish setting value.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is one of "none" | "mute" | "kick" | "ban".
 */
export const isAntiphishSettingValue = (
  setting: string
): setting is "none" | "mute" | "kick" | "ban" => {
  return ["none", "mute", "kick", "ban"].includes(setting);
};

/**
 * Confirms that a string is a valid style setting value.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is one of "embed" | "text".
 */
export const isStyleSettingValue = (
  setting: string
): setting is "embed" | "text" => {
  return ["embed", "text"].includes(setting);
};

/**
 * Confirms that a string is a valid string value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a string value in the database.
 */
export const isStringSetting = (setting: string): setting is StringSettings => {
  // turn this array into object map
  const obj: { [key in StringSettings]: string } = {
    levels: "levels",
    custom_welcome: "custom_welcome",
    link_message: "link_message",
    leave_message: "leave_message",
    sass_mode: "sass_mode",
    links: "links",
    profanity: "profanity",
    profanity_message: "profanity_message",
    appeal_link: "appeal_link",
    initial_xp: "initial_xp",
    level_message: "level_message",
    role_message: "role_message",
    starboard_emote: "starboard_emote",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid channel ID value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a channel ID value in the database.
 */
export const isChannelIdSetting = (
  setting: string
): setting is ChannelIdSettings => {
  const obj: { [key in ChannelIdSettings]: string } = {
    welcome_channel: "welcome_channel",
    depart_channel: "depart_channel",
    level_channel: "level_channel",
    suggestion_channel: "suggestion_channel",
    report_channel: "report_channel",
    message_events: "message_events",
    voice_events: "voice_events",
    thread_events: "thread_events",
    moderation_events: "moderation_events",
    member_events: "member_events",
    ticket_category: "ticket_category",
    ticket_log_channel: "ticket_log_channel",
    starboard_channel: "starboard_channel",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid role ID value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a role ID value in the database.
 */
export const isRoleIdSetting = (setting: string): setting is RoleIdSettings => {
  const obj: { [key in RoleIdSettings]: string } = {
    join_role: "join_role",
    ticket_role: "ticket_role",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid user ID array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a user ID array value in the database.
 */
export const isUserIdArraySetting = (
  setting: string
): setting is ArrayOfUserIdSettings => {
  const obj: { [key in ArrayOfUserIdSettings]: string } = {
    blocked: "blocked",
    hearts: "hearts",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid channel ID array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a channel ID array value in the database.
 */
export const isChannelIdArraySetting = (
  setting: string
): setting is ArrayOfChannelIdSettings => {
  const obj: { [key in ArrayOfChannelIdSettings]: string } = {
    automod_channels: "automod_channels",
    emote_channels: "emote_channels",
    level_ignore: "level_ignore",
    no_automod_channels: "no_automod_channels",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid role ID array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a role ID array value in the database.
 */
export const isRoleIdArraySetting = (
  setting: string
): setting is ArrayOfRoleIdSettings => {
  const obj: { [key in ArrayOfRoleIdSettings]: string } = {
    automod_roles: "automod_roles",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid level role array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a level role array value in the database.
 */
export const isLevelRoleArraySetting = (
  setting: string
): setting is ArrayOfLevelRoleSettings => {
  const obj: { [key in ArrayOfLevelRoleSettings]: string } = {
    level_roles: "level_roles",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid trigger array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a trigger array value in the database.
 */
export const isTriggerArraySetting = (
  setting: string
): setting is ArrayOfTriggerSettings => {
  const obj: { [key in ArrayOfTriggerSettings]: string } = {
    new_triggers: "new_triggers",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid string array value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a string array value in the database.
 */
export const isStringArraySetting = (
  setting: string
): setting is ArrayOfStringSettings => {
  const obj: { [key in ArrayOfStringSettings]: string } = {
    allowed_links: "allowed_links",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid number value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a number value in the database.
 */
export const isNumberSetting = (setting: string): setting is NumberSettings => {
  const obj: { [key in NumberSettings]: string } = {
    starboard_threshold: "starboard_threshold",
    level_decay: "level_decay",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid antiphish value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is an antiphish value in the database.
 */
export const isAntiphishSetting = (
  setting: string
): setting is AntiphishSettings => {
  const obj: { [key in AntiphishSettings]: string } = {
    antiphish: "antiphish",
  };
  return Object.keys(obj).includes(setting);
};

/**
 * Confirms that a string is a valid style value setting.
 *
 * @param {string} setting The setting to validate.
 * @returns {boolean} If setting is a style value in the database.
 */
export const isStyleSetting = (setting: string): setting is StyleSettings => {
  const obj: { [key in StyleSettings]: string } = {
    level_style: "level_style",
    welcome_style: "welcome_style",
  };
  return Object.keys(obj).includes(setting);
};
