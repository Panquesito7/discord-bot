import { EmbedBuilder } from "discord.js";

import { UserConfigCommandHandler } from "../../../interfaces/commands/UserConfigCommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles viewing a user's config.
 */
export const handleUserConfigView: UserConfigCommandHandler = async (
  Becca,
  interaction,
  t,
  userConfig
) => {
  try {
    const embed = new EmbedBuilder();
    embed.setColor(Becca.colours.default);
    embed.setTitle(t("commands:userconfig.view.title"));
    embed.setDescription(t("commands:userconfig.view.description"));
    embed.addFields([
      {
        name: t("commands:userconfig.view.levelcard.background"),
        value: userConfig.levelcard.background || "Not set.",
      },
      {
        name: t("commands:userconfig.view.levelcard.foreground"),
        value: userConfig.levelcard.foreground || "Not set.",
      },
      {
        name: t("commands:userconfig.view.levelcard.progress"),
        value: userConfig.levelcard.progress || "Not set.",
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
      "userconfig view",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "userconfig view", errorId, t)],
    });
  }
};
