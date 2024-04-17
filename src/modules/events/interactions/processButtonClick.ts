import { ButtonInteraction, Message } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { buttonInteractionHasNecessaryProperties } from "../../../utils/typeGuards";
import { logActivity } from "../../commands/logActivity";

import { buttonIsPoll } from "./buttons/buttonIsPoll";
import { buttonIsReaction } from "./buttons/buttonIsReaction";
import { buttonIsTicketClaim } from "./buttons/buttonIsTicketClaim";
import { buttonIsTicketClose } from "./buttons/buttonIsTicketClose";

/**
 * Handles the logic for button clicks.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const processButtonClick = async (
  Becca: BeccaLyria,
  interaction: ButtonInteraction,
  t: TFunction
) => {
  try {
    await logActivity(Becca, interaction.user.id, "button");
    if (interaction.customId === "cta") {
      await interaction.update({
        content: "Thank you for acknowledging. Please run your command again.",
        components: [],
      });
      if (!Becca.cta[interaction.user.id]) {
        Becca.cta[interaction.user.id] = true;
      }
      return;
    }
    if (interaction.customId === "delete-bookmark") {
      await (interaction.message as Message).delete();
    }

    if (!buttonInteractionHasNecessaryProperties(interaction)) {
      await interaction.reply({
        content: t<string, string>("events:interaction.noDms"),
      });
      return;
    }
    if (interaction.customId.startsWith("rr-")) {
      await interaction.deferReply({ ephemeral: true });
      await buttonIsReaction(Becca, interaction, t);
    }

    if (interaction.customId.startsWith("poll-")) {
      await buttonIsPoll(Becca, interaction, t);
    }

    if (interaction.customId === "ticket-claim") {
      await buttonIsTicketClaim(Becca, interaction, t);
    }

    if (interaction.customId === "ticket-close") {
      await buttonIsTicketClose(Becca, interaction, t);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "process button click",
      err,
      interaction.guild?.name
    );
  }
};
