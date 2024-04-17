import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * If the `role` parameter is passed, and if the value is a self-assignable role as
 * defined in the server's config, will assign or remove the role for the user.
 * If the `role` is not passed, generates a paginated embed listing the roles that can be
 * self-assigned.
 */
export const handleRole: CommandHandler = async (
  Becca,
  interaction,
  t
): Promise<void> => {
  try {
    await interaction.editReply({
      content: t("commands:community.role.deprecated"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "role command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "role", errorId, t)],
    });
  }
};
