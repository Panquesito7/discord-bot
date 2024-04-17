import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { Trivia } from "../../../interfaces/commands/games/Trivia";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { replaceHtml } from "../../../utils/replaceHtml";

/**
 * Fetches a trivia question from an API, generates it into an embed. Adds buttons
 * to that embed for the four answers, then collects button responses from users.
 * Tracks the users that answered correctly and announces the winners after 30 seconds.
 */
export const handleTrivia: CommandHandler = async (Becca, interaction, t) => {
  try {
    const letters = ["A", "B", "C", "D"];

    const data = await axios.get<Trivia>(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );

    const {
      category,
      correct_answer: correctAnswer,
      incorrect_answers: incorrectAnswers,
      question,
    } = data.data.results[0];

    const answers = incorrectAnswers.map((el) => replaceHtml(el));
    answers.push(replaceHtml(correctAnswer));
    answers.sort();

    const correctAnswerLetter =
      letters[answers.indexOf(replaceHtml(correctAnswer))];

    const answered: string[] = [];
    const correct: string[] = [];

    const triviaEmbed = new EmbedBuilder();
    triviaEmbed.setColor(Becca.colours.default);
    triviaEmbed.setTitle(category);
    triviaEmbed.setDescription(replaceHtml(question));
    triviaEmbed.addFields([
      {
        name: "A",
        value: answers[0],
        inline: true,
      },
      {
        name: "B",
        value: answers[1],
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
      {
        name: "C",
        value: answers[2],
        inline: true,
      },
      {
        name: "D",
        value: answers[3],
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
    ]);
    triviaEmbed.setFooter({
      text: t("commands:games.trivia.footer"),
    });

    const resultEmbed = new EmbedBuilder();

    const aButton = new ButtonBuilder()
      .setCustomId("a")
      .setLabel("A")
      .setStyle(ButtonStyle.Primary);
    const bButton = new ButtonBuilder()
      .setCustomId("b")
      .setLabel("B")
      .setStyle(ButtonStyle.Primary);
    const cButton = new ButtonBuilder()
      .setCustomId("c")
      .setLabel("C")
      .setStyle(ButtonStyle.Primary);
    const dButton = new ButtonBuilder()
      .setCustomId("d")
      .setLabel("D")
      .setStyle(ButtonStyle.Primary);

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      aButton,
      bButton,
      cButton,
      dButton
    );

    const sentEmbed = (await interaction.editReply({
      embeds: [triviaEmbed],
      components: [buttons],
    })) as Message;

    const answerCollector = sentEmbed.createMessageComponentCollector({
      time: 30000,
    });

    answerCollector.on("collect", async (click) => {
      if (answered.includes(click.user.id)) {
        await click.reply({
          content: t("commands:games.trivia.duplicate"),
          ephemeral: true,
        });
        return;
      }
      await click.reply({
        content: t("commands:games.trivia.answered", {
          answer: click.customId,
        }),
        ephemeral: true,
      });

      if (click.customId.toUpperCase() === correctAnswerLetter) {
        correct.push(click.user.id);
      }
      answered.push(click.user.id);
    });

    answerCollector.on("end", async () => {
      resultEmbed.setTimestamp();
      resultEmbed.setColor(Becca.colours.default);
      resultEmbed.setTitle(
        t("commands:games.trivia.result", {
          count: correct.length,
        })
      );
      resultEmbed.setDescription(
        customSubstring(correct.map((el) => `<@!${el}>`).join(", "), 4000)
      );
      resultEmbed.addFields([
        {
          name: t("commands:games.trivia.correct"),
          value: `${correctAnswerLetter}: ${replaceHtml(correctAnswer)}`,
        },
      ]);

      await interaction.channel?.send({ embeds: [resultEmbed] });
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "trivia command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "trivia", errorId, t)],
    });
  }
};
