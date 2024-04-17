import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Provides a link to the support server.
 */
export const handleServer: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.editReply({
      content: t("commands:support.server.response"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handle server",
      err,
      interaction.guild?.id,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "server", errorId, t)],
    });
  }
};
