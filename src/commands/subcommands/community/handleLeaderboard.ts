import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { formatTextToTable } from "../../../utils/formatText";

/**
 * If the server has enabled the level system, this generates an embed
 * containing the top ten users by experience points, their total XP and level,
 * and the rank of the user who called the command.
 */
export const handleLeaderboard: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guildId, guild } = interaction;

    const serverLevels = await Becca.db.newlevels.findMany({
      where: {
        serverID: guildId,
      },
      orderBy: {
        points: "desc",
      },
    });

    if (!serverLevels?.length) {
      await interaction.editReply({
        content: t("commands:community.leaderboard.disabled"),
      });
      return;
    }

    const mappedToObject = serverLevels.map((level, index) => ({
      rank: index + 1,
      id: level.userID,
      level: level.level,
      points: level.points,
      name: level.userTag,
    }));
    const mapped: [number, string, number, number][] = mappedToObject.map(
      (el) => [el.rank, el.name, el.level, el.points]
    );

    const authorLevel = mappedToObject.find(
      (el) => el.id === interaction.user.id
    );

    const rankString = authorLevel
      ? `You are rank ${authorLevel.rank} at level ${authorLevel.level} (${authorLevel.points} XP)`
      : "You have not earned any experience yet!";

    let page = 1;
    const lastPage = Math.ceil(mapped.length / 10);

    const pageBack = new ButtonBuilder()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle(ButtonStyle.Primary);
    const pageForward = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle(ButtonStyle.Primary);

    if (lastPage <= 1) {
      pageForward.setDisabled(true);
    }

    const levelEmbed = new EmbedBuilder();
    levelEmbed.setTitle(
      t("commands:community.leaderboard.title", {
        name: guild.name,
      })
    );
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.setDescription(
      `\`\`\`\n${formatTextToTable(mapped.slice(page * 10 - 10, page * 10), {
        headers: [
          t("commands:community.leaderboard.rank"),
          t("commands:community.leaderboard.user"),
          t("commands:community.leaderboard.level"),
          t("commands:community.leaderboard.xp"),
        ],
      })}\n\`\`\``
    );
    levelEmbed.setTimestamp();
    levelEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const response = await interaction.editReply({
      content: rankString,
      embeds: [levelEmbed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          pageBack,
          pageForward
        ),
      ],
    });

    const collector =
      response.createMessageComponentCollector<ComponentType.Button>({
        time: 30000,
        filter: (click) => click.user.id === interaction.user.id,
      });

    collector.on("collect", async (click) => {
      await click.deferUpdate();
      if (click.customId === "prev") {
        page--;
      }
      if (click.customId === "next") {
        page++;
      }

      if (page <= 1) {
        pageBack.setDisabled(true);
      } else {
        pageBack.setDisabled(false);
      }

      if (page >= lastPage) {
        pageForward.setDisabled(true);
      } else {
        pageForward.setDisabled(false);
      }

      levelEmbed.setDescription(
        `\`\`\`\n${formatTextToTable(mapped.slice(page * 10 - 10, page * 10), {
          headers: [
            t("commands:community.leaderboard.rank"),
            t("commands:community.leaderboard.user"),
            t("commands:community.leaderboard.level"),
            t("commands:community.leaderboard.xp"),
          ],
        })}\n\`\`\``
      );

      await interaction.editReply({
        content: rankString,
        embeds: [levelEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });

    collector.on("end", async () => {
      pageBack.setDisabled(true);
      pageForward.setDisabled(true);
      await interaction.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "leaderboard command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "leaderboard", errorId, t)],
    });
  }
};
