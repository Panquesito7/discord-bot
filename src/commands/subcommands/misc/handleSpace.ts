import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Space } from "../../../interfaces/commands/general/Space";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Fetches the latest Astronomy Photo of the Day from NASA, or the photo from
 * the given `date`.
 */
export const handleSpace: CommandHandler = async (Becca, interaction, t) => {
  try {
    if (!Becca.configs.nasaKey) {
      throw new Error("no nasaKey configured");
    }
    const date = interaction.options.getString("date");
    let url = `https://api.nasa.gov/planetary/apod?api_key=${Becca.configs.nasaKey}`;

    if (date) {
      if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
        interaction.editReply({
          content: t("commands:misc.space.invalid", { date }),
        });
        return;
      }
      url += `&date=${date}`;
    }

    const spaceEmbed = new EmbedBuilder();
    spaceEmbed.setTimestamp();

    const space = await axios.get<Space>(url, { validateStatus: null });
    if (!space.data || space.status !== 200) {
      spaceEmbed.setTitle(t("commands:misc.space.error.title"));
      spaceEmbed.setDescription(t("commands:misc.space.error.description"));
      spaceEmbed.setColor(Becca.colours.error);
      await interaction.editReply({ embeds: [spaceEmbed] });
    }

    spaceEmbed.setTitle(
      t("commands:misc.space.title", {
        date: date || space.data.date,
        title: space.data.title,
      })
    );
    spaceEmbed.setURL("https://apod.nasa.gov/apod/astropix.html");
    spaceEmbed.setDescription(customSubstring(space.data.explanation, 2000));
    spaceEmbed.setImage(space.data.hdurl);
    spaceEmbed.setFooter({
      text: `© ${space.data.copyright || t("commands:misc.space.copy")}`,
    });
    interaction.editReply({ embeds: [spaceEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "space command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "space", errorId, t)],
    });
  }
};
