import axios from "axios";
import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Xkcd } from "../../../interfaces/commands/general/Xkcd";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Fetches the latest XKCD comic, or the comic matching `number`.
 */
export const handleXkcd: CommandHandler = async (Becca, interaction, t) => {
  try {
    const number = interaction.options.getInteger("number");
    let url = "https://xkcd.com/";
    if (number) {
      url += `${number}/`;
    }
    url += "info.0.json";

    const xkcd = await axios.get<Xkcd>(url);

    const xkcdEmbed = new EmbedBuilder();
    xkcdEmbed.setTitle(xkcd.data.title);
    xkcdEmbed.setURL(xkcd.data.link || "https://xkcd.com");
    xkcdEmbed.setImage(xkcd.data.img);
    xkcdEmbed.setDescription(xkcd.data.alt);
    xkcdEmbed.setFooter({
      text: t("commands:misc.xkcd.footer", {
        num: xkcd.data.num,
      }),
    });
    xkcdEmbed.setColor(Becca.colours.default);
    xkcdEmbed.setTimestamp();

    await interaction.editReply({ embeds: [xkcdEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "xkcd command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "xkcd", errorId, t)],
    });
  }
};
