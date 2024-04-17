import { APIGuildMember, ChatInputCommandInteraction } from "discord.js";

export interface ValidatedChatInputCommandInteraction
  extends ChatInputCommandInteraction {
  guild: Exclude<ChatInputCommandInteraction["guild"], null>;
  guildId: Exclude<ChatInputCommandInteraction["guildId"], null>;
  member: Exclude<ChatInputCommandInteraction["member"], null | APIGuildMember>;
  channel: Exclude<ChatInputCommandInteraction["channel"], null>;
}
