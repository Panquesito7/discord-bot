import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Provides ids for inexperienced Discord users .
 */

export const handleIds: CommandHandler = async (Becca, interaction, t) => {
  const { user, channelId, guildId } = interaction;
  const userId = user.id;
  try {
    await interaction.editReply({
      content: t("commands:support.ids.message", {
        userId,
        channelId,
        guildId,
      }),
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
