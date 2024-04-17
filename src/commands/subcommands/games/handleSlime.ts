import { slimeList } from "../../../config/commands/slimeList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Generates a random slime-themed name from the slimeList and assigns it
 * as the user's nickname.
 */
export const handleSlime: CommandHandler = async (Becca, interaction, t) => {
  try {
    const member = interaction.member;
    const noun = getRandomValue(slimeList);

    await member
      .setNickname(`${noun}slime`)
      .then(async () => {
        await interaction.editReply(t("commands:games.slime.success"));
      })
      .catch(async () => {
        await interaction.editReply(t("commands:games.slime.failure"));
      });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "slime command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "slime", errorId, t)],
    });
  }
};
