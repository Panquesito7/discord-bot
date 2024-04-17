import { LevelRole } from "../../interfaces/settings/LevelRole";
import { Trigger } from "../../interfaces/settings/Trigger";

/**
 * This config maps the default values for the ServerModel document. Useful
 * for the reset command as well as instantiating new server settings.
 */
export const defaultServer = {
  levels: "off",
  welcome_channel: "",
  depart_channel: "",
  level_channel: "",
  suggestion_channel: "",
  custom_welcome:
    "Hello {@username}! Welcome to {@servername}! My name is Becca. Feel free to let me know if you need anything.",
  hearts: [] as string[],
  blocked: [] as string[],
  new_triggers: [] as Trigger[],
  automod_channels: [] as string[],
  no_automod_channels: [] as string[],
  automod_roles: [] as string[],
  allowed_links: [] as string[],
  link_message:
    "{@username}, it seems you are not allowed to send links in this channel.",
  level_roles: [] as LevelRole[],
  join_role: "",
  leave_message:
    "{@username}, thank you for your time in {@servername}. Your contributions are appreciated.",
  report_channel: "",
  level_ignore: [] as string[],
  sass_mode: "off",
  message_events: "",
  voice_events: "",
  thread_events: "",
  moderation_events: "",
  member_events: "",
  links: "off",
  profanity: "off",
  profanity_message:
    "{@username}, your message appears to have been inappropriate. I removed it.",
  emote_channels: [] as string[],
  appeal_link: "",
  antiphish: "none",
  initial_xp: "0",
  level_style: "embed",
  level_message: "",
  role_message: "",
  welcome_style: "embed",
  ticket_category: "",
  ticket_log_channel: "",
  ticket_role: "",
  starboard_emote: "",
  starboard_channel: "",
  starboard_threshold: 5,
  level_decay: 0,
};
