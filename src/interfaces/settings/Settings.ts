/**
 * Type definition for available guild setting names. This should be updated if
 * settings are added or removed.
 */
export type Settings =
  | ArrayOfIdSettings
  | ArrayOfStringSettings
  | ArrayOfLevelRoleSettings
  | ArrayOfTriggerSettings
  | StringSettings
  | NumberSettings
  | AntiphishSettings
  | StyleSettings
  | IdSettings;

export type ArrayOfIdSettings =
  | ArrayOfUserIdSettings
  | ArrayOfChannelIdSettings
  | ArrayOfRoleIdSettings;
export type ArrayOfUserIdSettings = "blocked" | "hearts";
export type ArrayOfChannelIdSettings =
  | "automod_channels"
  | "emote_channels"
  | "level_ignore"
  | "no_automod_channels";
export type ArrayOfRoleIdSettings = "automod_roles";

export type ArrayOfStringSettings = "allowed_links";
export type ArrayOfLevelRoleSettings = "level_roles";
export type ArrayOfTriggerSettings = "new_triggers";

export type StringSettings =
  | "custom_welcome"
  | "levels"
  | "link_message"
  | "leave_message"
  | "sass_mode"
  | "links"
  | "profanity"
  | "profanity_message"
  | "appeal_link"
  | "initial_xp"
  | "level_message"
  | "role_message"
  | "starboard_emote";

export type NumberSettings = "starboard_threshold" | "level_decay";

export type AntiphishSettings = "antiphish";

export type StyleSettings = "level_style" | "welcome_style";

export type IdSettings = ChannelIdSettings | RoleIdSettings;
export type ChannelIdSettings =
  | "welcome_channel"
  | "depart_channel"
  | "level_channel"
  | "suggestion_channel"
  | "report_channel"
  | "message_events"
  | "voice_events"
  | "thread_events"
  | "moderation_events"
  | "member_events"
  | "ticket_category"
  | "ticket_log_channel"
  | "starboard_channel";
export type RoleIdSettings = "join_role" | "ticket_role";
