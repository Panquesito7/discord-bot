import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  TextChannel,
  User,
} from "discord.js";

import { Context } from "../interfaces/contexts/Context";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const bookmark: Context = {
  data: {
    name: "bookmark",
    type: 3,
  },
  run: async (Becca, interaction, t): Promise<void> => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const message = interaction.options.getMessage("message") as Message;
      const channel = interaction.channel as TextChannel;
      const guild = interaction.guild.name;

      if (!message || !channel) {
        await interaction.editReply(t("contexts:bookmark.failed"));
        return;
      }

      const author = message.author as User;

      const bookmarkEmbed = new EmbedBuilder();
      bookmarkEmbed.setTitle(t("contexts:bookmark.title"));
      bookmarkEmbed.setDescription(message.url);
      bookmarkEmbed.setAuthor({
        name: author.tag,
        iconURL: author.displayAvatarURL(),
      });
      bookmarkEmbed.setColor(Becca.colours.default);
      bookmarkEmbed.addFields([
        {
          name: "Guild",
          value: guild,
          inline: true,
        },
        {
          name: "Channel",
          value: channel.name,
          inline: true,
        },
      ]);
      bookmarkEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      const deleteButton = new ButtonBuilder()
        .setCustomId("delete-bookmark")
        .setLabel(t("contexts:bookmark.deleteLabel"))
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        deleteButton,
      ]);

      await interaction.user
        .send({ embeds: [bookmarkEmbed], components: [row] })
        .then(async () => {
          await interaction.editReply(t("contexts:bookmark.success"));
        })
        .catch(async () => {
          await interaction.editReply(t("contexts:bookmark.noDm"));
        });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "bookmark context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "bookmark context", errorId, t)],
      });
    }
  },
};
