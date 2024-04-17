import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  time,
  TimestampStyles,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { calculateMilliseconds } from "../../../utils/calculateMilliseconds";

/**
 * Creates an embed containing the `question` as the description, the `a`, `b`,
 * `c`, and `d` options as fields, and attaches buttons for those options.
 * Clicking a button allows the user to vote for the option. Users can only vote
 * once.
 */
export const handlePoll: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild, channel } = interaction;

    const duration = interaction.options.getInteger("duration", true);
    const durationUnit = interaction.options.getString("unit", true);
    const question = interaction.options.getString("question", true);
    const optionA = interaction.options.getString("a", true);
    const optionB = interaction.options.getString("b", true);
    const optionC = interaction.options.getString("c", true);
    const optionD = interaction.options.getString("d", true);

    const millisecondDuration = calculateMilliseconds(duration, durationUnit);

    const endsAt = time(
      Math.floor((Date.now() + millisecondDuration) / 1000),
      TimestampStyles.RelativeTime
    );

    const pollEmbed = new EmbedBuilder();
    pollEmbed.setTitle(t("commands:community.poll.title"));
    pollEmbed.setDescription(question);
    pollEmbed.addFields([
      {
        name: "Poll Ends:",
        value: endsAt,
      },
      {
        name: "A",
        value: optionA,
        inline: true,
      },
      {
        name: "B",
        value: optionB,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
      {
        name: "C",
        value: optionC,
        inline: true,
      },
      {
        name: "D",
        value: optionD,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
    ]);
    pollEmbed.setColor(Becca.colours.default);
    pollEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const buttonA = new ButtonBuilder()
      .setEmoji("🇦")
      .setCustomId("poll-a")
      .setStyle(ButtonStyle.Primary);
    const buttonB = new ButtonBuilder()
      .setEmoji("🇧")
      .setCustomId("poll-b")
      .setStyle(ButtonStyle.Primary);
    const buttonC = new ButtonBuilder()
      .setEmoji("🇨")
      .setCustomId("poll-c")
      .setStyle(ButtonStyle.Primary);
    const buttonD = new ButtonBuilder()
      .setEmoji("🇩")
      .setCustomId("poll-d")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      buttonA,
      buttonB,
      buttonC,
      buttonD,
    ]);

    const pollMessage = await interaction.editReply({
      embeds: [pollEmbed],
      components: [row],
    });

    await Becca.db.polls.create({
      data: {
        serverId: guild.id,
        channelId: channel.id,
        messageId: pollMessage.id,
        results: {
          a: 0,
          b: 0,
          c: 0,
          d: 0,
        },
        responses: [],
        endsAt: Date.now() + millisecondDuration,
      },
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "poll command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "poll", errorId, t)],
    });
  }
};
