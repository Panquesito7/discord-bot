import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles removing a role from an existing reaction role post.
 */
export const handleRemove: CommandHandler = async (Becca, interaction, t) => {
  try {
    await interaction.editReply({
      content: "This command is temporarily unavailable.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reaction role create",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reactionrole create", errorId, t)],
    });
  }
};
