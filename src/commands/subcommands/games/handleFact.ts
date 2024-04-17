import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Fact } from "../../../interfaces/commands/games/Fact";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Generates an embed containing a random fun fact.
 */
export const handleFact: CommandHandler = async (Becca, interaction, t) => {
  try {
    const fact = await axios.get<Fact>(
      "https://uselessfacts.jsph.pl/random.json?language=en"
    );

    const factEmbed = new EmbedBuilder();
    factEmbed.setTitle(t("commands:games.fact.title"));
    factEmbed.setColor(Becca.colours.default);
    factEmbed.setDescription(customSubstring(fact.data.text, 4000));
    factEmbed.setURL(fact.data.source_url);
    factEmbed.setTimestamp();
    factEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [factEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "fact command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "fact", errorId, t)],
    });
  }
};
