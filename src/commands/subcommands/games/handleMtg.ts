import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { MagicCard } from "../../../interfaces/commands/games/MagicCard";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Fetches data from a Magic: The Gathering API to get information on
 * the `card`, and parses it into an embed.
 */
export const handleMtg: CommandHandler = async (Becca, interaction, t) => {
  try {
    const query = interaction.options.getString("card");

    const cards = await axios.get<MagicCard>(
      `https://api.magicthegathering.io/v1/cards?name=${query}&pageSize=1`
    );

    if (!cards?.data?.cards?.length) {
      await interaction.editReply({
        content: t("commands:games.mtg.no"),
      });
      return;
    }

    const card = cards.data.cards[0];

    const cardEmbed = new EmbedBuilder();
    cardEmbed.setColor(Becca.colours.default);
    cardEmbed.setTitle(card.name);
    cardEmbed.setImage(
      card.imageUrl || "https://cdn.nhcarrigan.com/content/projects/mtg.jpg"
    );
    cardEmbed.setDescription(card.flavor || t("commands:games.mtg.flavour"));
    cardEmbed.addFields([
      {
        name: t("commands:games.mtg.types"),
        value: card.types.join(", "),
      },
      {
        name: t("commands:games.mtg.cost"),
        value: card.manaCost,
      },
      {
        name: t("commands:games.mtg.abilities"),
        value: card.text || t("commands:games.mtg.ability"),
      },
    ]);
    cardEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [cardEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "mtg command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "mtg", errorId, t)],
    });
  }
};
