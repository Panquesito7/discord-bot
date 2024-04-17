import { EmbedBuilder } from "discord.js";

import { SusList } from "../../../config/commands/susList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Generates an embed with a random colour from Among Us, and delcares that
 * colour the new sus.
 */
export const handleSus: CommandHandler = async (Becca, interaction, t) => {
  try {
    const susData = getRandomValue(SusList);
    const susEmbed = new EmbedBuilder();
    susEmbed.setTitle(t("commands:games.sus.title"));
    susEmbed.setDescription(
      t("commands:games.sus.description", {
        color: susData.name,
      })
    );
    susEmbed.setColor(susData.colour);
    susEmbed.setTimestamp();
    susEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [susEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "sus command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "sus", errorId, t)],
    });
  }
};
