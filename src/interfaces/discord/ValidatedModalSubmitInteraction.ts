import { ModalSubmitInteraction } from "discord.js";

export interface ValidatedModalSubmitInteraction
  extends ModalSubmitInteraction {
  guild: Exclude<ModalSubmitInteraction["guild"], null>;
}
