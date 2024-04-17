import { EmbedBuilder } from "discord.js";

import { UserConfigCommandHandler } from "../../../interfaces/commands/UserConfigCommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles setting a user's levelcard configuration.
 */
export const handleLevelCard: UserConfigCommandHandler = async (
  Becca,
  interaction,
  t,
  userConfig
) => {
  try {
    const { user } = interaction;

    const background = interaction.options.getString("background", true);
    const foreground = interaction.options.getString("foreground", true);
    const progress = interaction.options.getString("progress", true);

    const hexRegex = /#[a-f\d]{6}/i;
    if (![background, foreground, progress].every((el) => hexRegex.test(el))) {
      await interaction.editReply({
        content: t("commands:userconfig.levelcard.invalidColour"),
      });
      return;
    }

    userConfig.levelcard = { background, foreground, progress };

    await Becca.db.userconfigs.update({
      where: {
        userId: user.id,
      },
      data: {
        levelcard: userConfig.levelcard,
      },
    });

    const embed = new EmbedBuilder();
    embed.setTitle(t("commands:userconfig.levelcard.title"));
    embed.setDescription(t("commands:userconfig.levelcard.description"));
    embed.setColor(Becca.colours.default);
    embed.addFields([
      {
        name: t("commands:userconfig.levelcard.background"),
        value: background || "Not set.",
      },
      {
        name: t("commands:userconfig.levelcard.foreground"),
        value: foreground || "Not set.",
      },
      {
        name: t("commands:userconfig.levelcard.progress"),
        value: progress || "Not set.",
      },
    ]);
    embed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "userconfig levelcard",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "userconfig levelcard", errorId, t)],
    });
  }
};
