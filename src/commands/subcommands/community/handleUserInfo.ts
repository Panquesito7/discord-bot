import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { FetchWrapper } from "../../../utils/FetchWrapper";

/**
 * Generates an embed containing information about the given `user`, or the author.
 */
export const handleUserInfo: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user, guild } = interaction;

    const mentioned = interaction.options.getUser("user");

    const target = await FetchWrapper.member(guild, mentioned?.id || user.id);

    if (!target) {
      await interaction.editReply({
        content: t("commands:community.userinfo.nouser"),
      });
      return;
    }

    const userEmbed = new EmbedBuilder();
    userEmbed.setColor(Becca.colours.default);
    userEmbed.setTitle(target.displayName);
    userEmbed.setThumbnail(target.user.displayAvatarURL());
    userEmbed.setDescription(
      t("commands:community.userinfo.description", {
        user: `<@!${target.id}>`,
      })
    );
    userEmbed.addFields([
      {
        name: t("commands:community.userinfo.create"),
        value: new Date(target.user.createdTimestamp).toLocaleDateString(),
        inline: true,
      },
      {
        name: t("commands:community.userinfo.join"),
        value: new Date(
          target.joinedTimestamp || Date.now()
        ).toLocaleDateString(),
        inline: true,
      },
      {
        name: t("commands:community.userinfo.username"),
        value: target.user.username,
        inline: true,
      },
      {
        name: t("commands:community.userinfo.roles"),
        value: customSubstring(
          target.roles.cache
            .filter((role) => role.id !== guild.id)
            .map((role) => `<@&${role.id}>`)
            .join(" "),
          1000
        ),
      },
      {
        name: t("commands:community.userinfo.colour"),
        value: target.displayHexColor,
        inline: true,
      },
      {
        name: t("commands:community.userinfo.nitro"),
        value: target.premiumSinceTimestamp
          ? `Since ${new Date(
              target.premiumSinceTimestamp
            ).toLocaleDateString()}`
          : "No.",
        inline: true,
      },
    ]);
    userEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [userEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "user info command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "user info", errorId, t)],
    });
  }
};
