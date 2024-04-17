import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { getOptOutRecord } from "../../../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * Generates an embed to give the `user` a gold star for the given `reason`. If the user
 * has not opted out from the tracking, also increments that user's starcount in the database.
 */
export const handleStar: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member, guild } = interaction;

    const targetUser = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);

    const optout = await getOptOutRecord(Becca, targetUser.id);

    if (!optout || optout.star) {
      await interaction.editReply(t("commands:community.star.optout"));
      return;
    }

    const starData =
      (await Becca.db.starcounts.findFirst({
        where: {
          serverID: guild.id,
        },
      })) ||
      (await Becca.db.starcounts.create({
        data: {
          serverID: guild.id,
          serverName: guild.name,
          users: [],
        },
      }));

    const targetUserStars = starData.users.find(
      (u) => u.userID === targetUser.id
    );
    if (!targetUserStars) {
      starData.users.push({
        userID: targetUser.id,
        userTag: targetUser.username,
        avatar: targetUser.displayAvatarURL(),
        stars: 1,
      });
    } else {
      targetUserStars.stars++;
      targetUserStars.userTag = targetUser.username;
      targetUserStars.avatar = targetUser.displayAvatarURL();
    }

    await Becca.db.starcounts.update({
      where: {
        serverID: guild.id,
      },
      data: {
        users: starData.users,
        serverName: guild.name,
      },
    });

    const starTotal = targetUserStars?.stars || 1;

    const starEmbed = new EmbedBuilder();
    starEmbed.setTitle(
      t("commands:community.star.title", {
        user: targetUser.username,
      })
    );
    starEmbed.setDescription(
      t("commands:community.star.description", {
        user: member.user.username,
      })
    );
    starEmbed.addFields([
      {
        name: t("commands:community.star.reason"),
        value: customSubstring(reason, 2000),
      },
    ]);
    starEmbed.setFooter({
      text: t("commands:community.star.total", {
        total: starTotal,
      }),
    });
    starEmbed.setColor(Becca.colours.default);
    starEmbed.setTimestamp();
    starEmbed.setImage("https://cdn.nhcarrigan.com/projects/star.png");

    await interaction.editReply({ embeds: [starEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "star command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "star", errorId, t)],
    });
  }
};
