import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { generateLevelHtml } from "../../../modules/commands/community/generateLevelHtml";
import { generateLevelImage } from "../../../modules/commands/community/generateLevelImage";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Returns the current level ranking information for the given `user-level` or the author.
 * Does not work if levels are disabled.
 */
export const handleLevel: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guildId, guild, user } = interaction;

    const target = interaction.options.getUser("user-level") || user;

    const targetLevel = await Becca.db.newlevels.findUnique({
      where: {
        serverID_userID: {
          serverID: guildId,
          userID: target.id,
        },
      },
    });

    if (!targetLevel) {
      await interaction.editReply({
        content: t("commands:community.level.none", {
          user: `<@!${target.id}>`,
        }),
      });
      return;
    }

    const levelCardHtml = await generateLevelHtml(Becca, target, targetLevel);
    const levelCardImage = await generateLevelImage(levelCardHtml);

    const levelEmbed = new EmbedBuilder();
    levelEmbed.setColor(Becca.colours.default);
    levelEmbed.setTitle(
      t("commands:community.level.title", { user: target.tag })
    );
    levelEmbed.setDescription(
      t("commands:community.level.description", {
        name: guild.name,
      })
    );
    levelEmbed.addFields([
      {
        name: t("commands:community.level.points"),
        value: targetLevel.points.toString(),
        inline: true,
      },
      {
        name: t("commands:community.level.level"),
        value: targetLevel.level.toString(),
        inline: true,
      },
      {
        name: t("commands:community.level.seen"),
        value: `${new Date(targetLevel.lastSeen).toLocaleDateString()}`,
      },
    ]);
    levelEmbed.setTimestamp();
    levelEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    levelEmbed.setImage("attachment://level.png");

    await interaction.editReply({
      embeds: [levelEmbed],
      files: [levelCardImage],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "level command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "level", errorId, t)],
    });
  }
};
