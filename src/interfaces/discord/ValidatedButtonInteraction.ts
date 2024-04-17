import { APIInteractionGuildMember, ButtonInteraction } from "discord.js";

export interface ValidatedButtonInteraction extends ButtonInteraction {
  guild: Exclude<ButtonInteraction["guild"], null>;
  member: Exclude<
    ButtonInteraction["member"],
    null | APIInteractionGuildMember
  >;
}
