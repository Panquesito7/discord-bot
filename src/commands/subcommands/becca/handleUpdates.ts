import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { updatesSinceLastRelease } from "../../../config/commands/updatesData";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed explaining the new release schedule, and what the update
 * process breaks in terms of lost cache.
 */
export const handleUpdates: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { commitHash: hash } = Becca;
    const updateEmbed = new EmbedBuilder();
    updateEmbed.setTitle(t("commands:becca.updates.title"));
    updateEmbed.setDescription(updatesSinceLastRelease.join("\n"));
    updateEmbed.addFields([
      {
        name: t("commands:becca.updates.version"),
        value: process.env.npm_package_version || "0.0.0",
      },
      {
        name: t("commands:becca.updates.changelog.title"),
        value: t("commands:becca.updates.changelog.description"),
      },
      {
        name: t("commands:becca.updates.commit"),
        value: `[${hash.slice(
          0,
          7
        )}](https://github.com/beccalyria/discord-bot/commit/${hash})`,
      },
    ]);
    updateEmbed.setColor(Becca.colours.default);
    updateEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const button = new ButtonBuilder()
      .setLabel(t("commands:becca.updates.buttons.view"))
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://becca.nhcarrigan.com/#/changelog?utm_source=discord&utm_medium=updates-command"
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([button]);
    await interaction.editReply({ embeds: [updateEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "updates command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "updates", errorId, t)],
    });
  }
};
