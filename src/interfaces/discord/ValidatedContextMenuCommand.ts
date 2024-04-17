import { ContextMenuCommandInteraction } from "discord.js";

export interface ValidatedContextMenuCommandInteraction
  extends ContextMenuCommandInteraction {
  guild: Exclude<ContextMenuCommandInteraction["guild"], null>;
  guildId: Exclude<ContextMenuCommandInteraction["guildId"], null>;
}
