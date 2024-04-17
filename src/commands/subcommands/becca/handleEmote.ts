import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { emoteList } from "../../../config/commands/emoteList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Using the artList config, selects a random art object and parses it
 * into an embed. The actual images are fetched from Becca's profile site.
 */
export const handleEmote: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { emoteName, description, fileName } = getRandomValue(emoteList);

    const emoteEmbed = new EmbedBuilder();
    emoteEmbed.setTitle(emoteName);
    emoteEmbed.setColor(Becca.colours.default);
    emoteEmbed.setDescription(description);
    emoteEmbed.setImage(`https://cdn.naomi.lgbt/becca/emotes/${fileName}`);
    emoteEmbed.setFooter({
      text: t("commands:becca.emote.footer"),
    });

    const button = new ButtonBuilder()
      .setLabel(t("commands:becca.emote.buttons.more"))
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://www.beccalyria.com/emotes?utm_source=discord&utm_medium=emote-command"
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);

    await interaction.editReply({ embeds: [emoteEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote", errorId, t)],
    });
  }
};
