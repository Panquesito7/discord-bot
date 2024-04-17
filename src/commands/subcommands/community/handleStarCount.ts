import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { formatTextToTable } from "../../../utils/formatText";

/**
 * Generates an embed listing the top ten users with the most stars received in the
 * server, and includes the user's rank.
 */
export const handleStarCount: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { member, guild } = interaction;

    const starCounts = await Becca.db.starcounts.findUnique({
      where: {
        serverID: guild.id,
      },
    });

    if (!starCounts?.users.length) {
      await interaction.editReply({
        content: t("commands:community.starcount.none"),
      });
      return;
    }

    const userStars = starCounts.users.find((u) => u.userID === member.user.id);
    const userRank = starCounts.users.findIndex(
      (u) => u.userID === member.user.id
    );

    const topTen = starCounts.users
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 10);

    const userRankString = userStars
      ? t("commands:community.starcount.star", {
          user: member.user.username,
          rank: userRank + 1,
          stars: userStars?.stars || 0,
        })
      : t("commands:community.starcount.nostar", {
          user: member.user.username,
        });

    const topTenArray = topTen.map((u, index) => [
      index + 1,
      u.userTag,
      u.stars,
    ]);

    const starEmbed = new EmbedBuilder();
    starEmbed.setTitle(
      t("commands:community.starcount.embed.title", {
        guild: guild.name,
      })
    );
    starEmbed.setColor(Becca.colours.default);
    starEmbed.setDescription(
      `\`\`\`\n${formatTextToTable(topTenArray, {
        headers: [
          t("commands:community.starcount.embed.rank"),
          t("commands:community.starcount.embed.user"),
          t("commands:community.starcount.embed.stars"),
        ],
      })}\n\`\`\``
    );
    starEmbed.addFields([
      {
        name: t("commands:community.starcount.embed.yours"),
        value: userRankString,
      },
    ]);
    starEmbed.setTimestamp();
    starEmbed.setFooter({
      text: "Like the bot? Donate: https://donate.nhcarrigan.com",
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [starEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "star count command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "star count", errorId, t)],
    });
  }
};
