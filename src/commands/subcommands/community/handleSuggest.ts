import {
  EmbedBuilder,
  TextChannel,
  ForumChannel,
  ChannelType,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";

/**
 * If the server has configured a suggestion channel, this generates an embed
 * from the given `suggestion` and sends it to that channel. Becca will then react to that
 * suggestion to allow users to vote on it.
 */
export const handleSuggest: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, user: author } = interaction;
    const suggestion = interaction.options.getString("suggestion", true);

    if (!config.suggestion_channel) {
      await interaction.editReply({
        content: t("commands:community.suggest.disabled"),
      });
      return;
    }

    const suggestionChannel = guild.channels.cache.find(
      (el) => el.id === config.suggestion_channel
    ) as TextChannel | ForumChannel;

    if (!suggestionChannel) {
      await interaction.editReply({
        content: t("commands:community.suggest.lost"),
      });
      return;
    }

    const suggestionEmbed = new EmbedBuilder();
    suggestionEmbed.setTitle(t("commands:community.suggest.title"));
    suggestionEmbed.setTimestamp();
    suggestionEmbed.setColor(Becca.colours.default);
    suggestionEmbed.setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL(),
    });
    suggestionEmbed.setDescription(customSubstring(suggestion, 2000));
    suggestionEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    if (suggestionChannel.type === ChannelType.GuildForum) {
      // send to forum channel
      const newThread = await suggestionChannel.threads.create({
        name: t("commands:community.suggest.title"),
        autoArchiveDuration: 60,
        reason: "Suggestion",
        message: {
          embeds: [suggestionEmbed],
        },
      });
      const sentMessage = await newThread.fetchStarterMessage();

      if (!sentMessage) {
        return;
      }
      await sentMessage.react(Becca.configs.yes).catch(async () => {
        await sentMessage.react("✅");
      });
      await sentMessage.react(Becca.configs.no).catch(async () => {
        await sentMessage.react("❌");
      });
      return;
    } else {
      const sentMessage = await suggestionChannel.send({
        embeds: [suggestionEmbed],
      });
      await sentMessage.react(Becca.configs.yes).catch(async () => {
        await sentMessage.react("✅");
      });
      await sentMessage.react(Becca.configs.no).catch(async () => {
        await sentMessage.react("❌");
      });

      await interaction.editReply({
        content: t("commands:community.suggest.success"),
      });
    }
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "suggest command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "suggest", errorId, t)],
    });
  }
};
