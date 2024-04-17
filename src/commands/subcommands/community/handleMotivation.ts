import { EmbedBuilder } from "discord.js";

import { motivationalQuotes } from "../../../config/commands/motivationalQuotes";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Returns a random motivational quote, formatted in an embed.
 */
export const handleMotivation: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const quote = getRandomValue(motivationalQuotes);
    const quoteEmbed = new EmbedBuilder();
    quoteEmbed.setTitle("We are counting on you!");
    quoteEmbed.setDescription(quote.quote);
    quoteEmbed.setFooter({ text: quote.author });
    quoteEmbed.setTimestamp();
    quoteEmbed.setColor(Becca.colours.default);
    quoteEmbed.setFooter({
      text: "Like the bot? Donate: https://donate.nhcarrigan.com",
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [quoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "motivation command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "motivation", errorId, t)],
    });
  }
};
