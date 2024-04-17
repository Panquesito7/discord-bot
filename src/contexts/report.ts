import { ChannelType, EmbedBuilder, Message } from "discord.js";

import { Context } from "../interfaces/contexts/Context";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { customSubstring } from "../utils/customSubstring";
import { FetchWrapper } from "../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../utils/tFunctionWrapper";

export const report: Context = {
  data: {
    name: "report",
    type: 3,
  },
  run: async (Becca, interaction, t, config) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const { guild } = interaction;
      const message = interaction.options.getMessage("message") as Message;

      if (!message || message.channel.type === ChannelType.DM) {
        await interaction.editReply({
          content: tFunctionArrayWrapper(t, "responses:missingGuild"),
        });
        return;
      }

      const reportChannel = await FetchWrapper.channel(
        guild,
        config.report_channel
      );

      if (!reportChannel?.isTextBased() || !config.report_channel) {
        await interaction.editReply(t("contexts:report.notEnabled"));
        return;
      }

      const author = message.author;

      const reportEmbed = new EmbedBuilder();
      reportEmbed.setTitle(t("contexts:report.title"));
      reportEmbed.setDescription(
        `${customSubstring(message.content || "no content found!", 4000)}`
      );
      reportEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      reportEmbed.setColor(Becca.colours.default);
      reportEmbed.addFields([
        {
          name: "Channel",
          value: message.channel.name,
          inline: true,
        },
        {
          name: "Link",
          value: message.url,
          inline: true,
        },
      ]);
      reportEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      await reportChannel.send({
        content: t("contexts:report.reported", {
          mention: `<@!${interaction.user.id}>`,
        }),
        embeds: [reportEmbed],
      });
      await interaction.editReply(t("contexts:report.success"));
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "report context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "report context", errorId, t)],
      });
    }
  },
};
