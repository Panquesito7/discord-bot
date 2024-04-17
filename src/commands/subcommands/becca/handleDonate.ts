import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed containing the various links through which a user
 * can sponsor Becca's development.
 */
export const handleDonate: CommandHandler = async (Becca, interaction, t) => {
  try {
    const sponsorEmbed = new EmbedBuilder();
    sponsorEmbed.setTitle(t("commands:becca.donate.title"));
    sponsorEmbed.setColor(Becca.colours.default);
    sponsorEmbed.setDescription(t("commands:becca.donate.description"));
    sponsorEmbed.setFooter({
      text: t("commands:becca.donate.footer"),
    });

    const githubButton = new ButtonBuilder()
      .setLabel(t("commands:becca.donate.buttons.github"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/sponsors/nhcarrigan");
    const patreonButton = new ButtonBuilder()
      .setLabel(t("commands:becca.donate.buttons.patreon"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://www.patreon.com/nhcarrigan");
    const paypalButton = new ButtonBuilder()
      .setLabel("commands:becca.donate.buttons.paypal")
      .setStyle(ButtonStyle.Link)
      .setURL("https://paypal.me/nhcarrigan");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      githubButton,
      patreonButton,
      paypalButton,
    ]);

    await interaction.editReply({ embeds: [sponsorEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "donate command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "donate", errorId, t)],
    });
  }
};
