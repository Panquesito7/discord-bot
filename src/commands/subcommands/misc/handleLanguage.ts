import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Returns a user's language settings.
 */
export const handleLanguage: CommandHandler = async (Becca, interaction, t) => {
  try {
    const userLang = interaction.locale;
    const guildLang = interaction.guildLocale;
    const langEmbed = new EmbedBuilder();
    langEmbed.setTitle(t("commands:misc.language.title"));
    langEmbed.setDescription(t("commands:misc.language.description"));
    langEmbed.addFields([
      {
        name: t("commands:misc.language.yours"),
        value: userLang,
        inline: true,
      },
      {
        name: t("commands:misc.language.server"),
        value: guildLang || "unset",
        inline: true,
      },
    ]);
    await interaction.editReply({ embeds: [langEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "language command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "language", errorId, t)],
    });
  }
};
