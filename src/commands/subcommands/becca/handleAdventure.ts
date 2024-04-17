import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { adventureList } from "../../../config/commands/adventureList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Using the adventureList config, selects a random adventure object and parses it
 * into an embed. The actual images are fetched from Becca's profile site.
 */
export const handleAdventure: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { fileName, gameName, gameUrl } = getRandomValue(adventureList);

    const adventureEmbed = new EmbedBuilder();
    adventureEmbed.setTitle(gameName);
    adventureEmbed.setColor(Becca.colours.default);
    adventureEmbed.setDescription(
      t("commands:becca.adventure.description", {
        name: gameName,
        url: gameUrl,
      })
    );
    adventureEmbed.setImage(
      `https://cdn.naomi.lgbt/becca/games/${fileName.replace(/\s/g, "%20")}`
    );
    adventureEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const artButton = new ButtonBuilder()
      .setLabel(t("commands:becca.adventure.buttons.more"))
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://beccalyria.com/adventures?utm_source=discord&utm_medium=art-command"
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      artButton,
    ]);

    await interaction.editReply({
      embeds: [adventureEmbed],
      components: [row],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "adventure command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "adventure", errorId, t)],
    });
  }
};
