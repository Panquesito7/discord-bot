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
 * Generates an embed containing a link to invite Becca. The link is handled
 * by Becca's domain, to ensure it is up to date with permission and scope
 * changes.
 */
export const handleInvite: CommandHandler = async (Becca, interaction, t) => {
  try {
    const inviteEmbed = new EmbedBuilder();
    inviteEmbed.setTitle(t("commands:becca.invite.title"));
    inviteEmbed.setDescription("");
    inviteEmbed.setColor(Becca.colours.default);
    inviteEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    inviteEmbed.setTimestamp();

    const inviteButton = new ButtonBuilder()
      .setLabel(t("commands:becca.invite.buttons.invite"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://invite.beccalyria.com");
    const supportServerButton = new ButtonBuilder()
      .setLabel(t("commands:becca.invite.buttons.support"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://chat.nhcarrigan.com");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      inviteButton,
      supportServerButton,
    ]);

    await interaction.editReply({ embeds: [inviteEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "invite command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "invite", errorId, t)],
    });
  }
};
