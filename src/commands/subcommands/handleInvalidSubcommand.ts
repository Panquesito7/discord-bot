import { CommandHandler } from "../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../utils/tFunctionWrapper";

/**
 * This handles a case where a proper subcommand handler isn't found.
 */
export const handleInvalidSubcommand: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    await interaction.editReply({
      content: tFunctionArrayWrapper(t, "responses:invalidCommand"),
    });
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "invalid subcommand",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
  }
};
