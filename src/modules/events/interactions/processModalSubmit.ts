import { ModalSubmitInteraction } from "discord.js";
import { TFunction } from "i18next";

import { handleCreateModal } from "../../../commands/subcommands/post/handleCreateModal";
import { handleEditModal } from "../../../commands/subcommands/post/handleEditModal";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";
import { modalSubmitHasNecessaryProperties } from "../../../utils/typeGuards";

/**
 * Handles the logic for modal submissions.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const processModalSubmit = async (
  Becca: BeccaLyria,
  interaction: ModalSubmitInteraction,
  t: TFunction
) => {
  try {
    if (!modalSubmitHasNecessaryProperties(interaction)) {
      await interaction.reply({
        content: tFunctionArrayWrapper(t, "responses:missingGuild"),
      });
      return;
    }
    if (interaction.customId.startsWith("pc-")) {
      await handleCreateModal(Becca, interaction, t);
    }
    if (interaction.customId.startsWith("pe-")) {
      await handleEditModal(Becca, interaction, t);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "process modal submit",
      err,
      interaction.guild?.name
    );
  }
};
