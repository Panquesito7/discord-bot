import { Message } from "discord.js";

export interface ValidatedMessage extends Message {
  guild: Exclude<Message["guild"], null>;
  member: Exclude<Message["member"], null>;
}
