import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles the feedback command, providing an embed with a link to the
 * feedback site.
 */
export const handleFeedback: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    embed.setTitle(t("commands:becca.feedback.title"));
    embed.setDescription(t("commands:becca.feedback.description"));

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "feedback command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "feedback", errorId, t)],
    });
  }
};
