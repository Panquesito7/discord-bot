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
 * Generates an embed with a link to Becca's profile site, where users
 * can read about her adventures.
 */
export const handleProfile: CommandHandler = async (Becca, interaction, t) => {
  try {
    const profileEmbed = new EmbedBuilder();
    profileEmbed.setColor(Becca.colours.default);
    profileEmbed.setTitle(t("commands:becca.profile.title"));
    profileEmbed.setDescription(t("commands:becca.profile.description"));
    profileEmbed.setThumbnail(Becca.user?.avatarURL() || "");
    profileEmbed.setFooter({
      text: "Like the bot? Donate: https://donate.nhcarrigan.com",
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const profileButton = new ButtonBuilder()
      .setLabel(t("commands:becca.profile.buttons.view"))
      .setStyle(ButtonStyle.Link)
      .setURL(
        "https://www.beccalyria.com?utm_source=discord&utm_medium=profile-command"
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      profileButton,
    ]);

    await interaction.editReply({ embeds: [profileEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "profile command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "profile", errorId, t)],
    });
  }
};
