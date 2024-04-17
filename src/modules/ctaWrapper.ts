import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
} from "discord.js";

import { CallToAction } from "../config/CallToAction";
import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Intercepts a slash command to display the configured call to action,
 * if the user has not already acknowledged it.
 *
 * @param {BeccaLyria} bot The bot's Discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @returns {boolean} True if the user has already acknowledged the call to action, indicating the regular
 * command logic should run.
 */
export const ctaWrapper = async (
  bot: BeccaLyria,
  interaction: ChatInputCommandInteraction
): Promise<boolean> => {
  try {
    if (bot.cta[interaction.user.id]) {
      return true;
    }
    const ctaBtn = new ButtonBuilder()
      .setCustomId("cta")
      .setLabel("Acknowledge")
      .setStyle(ButtonStyle.Success);
    const donateBtn = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("Donate")
      .setURL("https://donate.nhcarrigan.com");
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      ctaBtn,
      donateBtn
    );
    await interaction.reply({
      content: CallToAction,
      components: [row],
      ephemeral: true,
    });
    return false;
  } catch (err) {
    await beccaErrorHandler(
      bot,
      "cta wrapper",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    return false;
  }
};
