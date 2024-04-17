import { EmbedBuilder } from "discord.js";

import { topicList } from "../../../config/commands/topicList";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";

/**
 * Generates an embed containing a random conversation starter from the topicList.
 */
export const handleTopic: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user } = interaction;

    const topicArray = topicList.split("\n");

    const randomTopic = getRandomValue(topicArray);

    const topicEmbed = new EmbedBuilder();
    topicEmbed.setTitle(t("commands:community.topic.title"));
    topicEmbed.setDescription(randomTopic);
    topicEmbed.setColor(Becca.colours.default);
    topicEmbed.setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    });
    topicEmbed.setFooter({
      text: t("commands:community.topic.footer"),
    });

    await interaction.editReply({ embeds: [topicEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "topic command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "topic", errorId, t)],
    });
  }
};
