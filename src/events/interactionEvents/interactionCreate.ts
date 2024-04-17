import { Interaction } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { logActivity } from "../../modules/commands/logActivity";
import { ctaWrapper } from "../../modules/ctaWrapper";
import { processButtonClick } from "../../modules/events/interactions/processButtonClick";
import { processChatInputCommand } from "../../modules/events/interactions/processChatInputCommand";
import { processContextMenuCommand } from "../../modules/events/interactions/processContextMenuCommand";
import { processModalSubmit } from "../../modules/events/interactions/processModalSubmit";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getInteractionLanguage } from "../../utils/getLangCode";

/**
 * Processes logic when a new interaction is created. Interactions come in various
 * forms, and represent some sort of user engagement with Becca on Discord.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Interaction} interaction The interaction payload received from Discord.
 */
export const interactionCreate = async (
  Becca: BeccaLyria,
  interaction: Interaction
): Promise<void> => {
  try {
    const lang = getInteractionLanguage(interaction);
    const t = getFixedT(lang);
    if (interaction.isChatInputCommand()) {
      const cta = await ctaWrapper(Becca, interaction);
      if (!cta) {
        return;
      }
      await processChatInputCommand(Becca, interaction, t);
    }

    if (interaction.isContextMenuCommand()) {
      await processContextMenuCommand(Becca, interaction, t);
    }

    if (interaction.isButton()) {
      await processButtonClick(Becca, interaction, t);
    }

    if (interaction.isStringSelectMenu()) {
      await logActivity(Becca, interaction.user.id, "select");
    }

    if (interaction.isModalSubmit()) {
      await processModalSubmit(Becca, interaction, t);
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "interaction create event", err);
  }
};
