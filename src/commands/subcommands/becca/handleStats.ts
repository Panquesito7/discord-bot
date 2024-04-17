import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

export const handleStats: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user: author } = interaction;

    const view = interaction.options.getString("view");

    if (view === "svotes") {
      const topVotes = await Becca.db.voters.findMany({
        take: 10,
        orderBy: {
          serverVotes: "desc",
        },
      });

      const serverVoteEmbed = topVotes
        .map(
          (el, i) =>
            `#${i + 1}: ${t("commands:becca.stats.bot.votes", {
              user: `<@!${el.userId}>`,
              votes: el.serverVotes,
            })}`
        )
        .join("\n");

      const serverEmbed = new EmbedBuilder();
      serverEmbed.setTitle(t("commands:becca.stats.server.title"));
      serverEmbed.setTimestamp();
      serverEmbed.setColor(Becca.colours.default);
      serverEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      serverEmbed.setDescription(serverVoteEmbed);
      serverEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      const supportServerButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.buttons.support"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://chat.nhcarrigan.com");
      const voteServerButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.buttons.server"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/servers/778130114772598785/vote");

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        supportServerButton,
        voteServerButton,
      ]);

      await interaction.editReply({ embeds: [serverEmbed], components: [row] });
      return;
    }

    if (view === "bvotes") {
      const topVotes = await Becca.db.voters.findMany({
        take: 10,
        orderBy: {
          botVotes: "desc",
        },
      });

      const botVoteEmbed = topVotes
        .map(
          (el, i) =>
            `#${i + 1}: ${t("commands:becca.stats.bot.votes", {
              user: `<@!${el.userId}>`,
              votes: el.botVotes,
            })}`
        )
        .join("\n");

      const botEmbed = new EmbedBuilder();
      botEmbed.setTitle(t("commands:becca.stats.bot.title"));
      botEmbed.setTimestamp();
      botEmbed.setColor(Becca.colours.default);
      botEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      botEmbed.setDescription(botVoteEmbed);
      botEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      const supportServerButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.button.support"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://chat.nhcarrigan.com");
      const voteBotButton = new ButtonBuilder()
        .setLabel(t("commands:becca.stats.buttons.bot"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/716707753090875473/vote");
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        supportServerButton,
        voteBotButton,
      ]);

      await interaction.editReply({ embeds: [botEmbed], components: [row] });
      return;
    }

    await interaction.editReply({
      content: t("commands:becca.stats.invalid"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "stats command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "stats", errorId, t)],
    });
  }
};
