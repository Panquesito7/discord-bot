/* eslint-disable jsdoc/require-param */
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../../utils/parseSeconds";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Allows a user to play a game of 21 with Becca, similar to Blackjack. If the user
 * wins, increases their currency by `wager`. Otherwise decreases it.
 * Can be used once an hour.
 */
export const handleTwentyOne: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const wager = interaction.options.getInteger("wager");

    if (!wager || wager < 1) {
      await interaction.editReply(t("commands:currency.twentyone.nowager"));
      return;
    }

    if (wager > data.currencyTotal) {
      await interaction.editReply(
        t("commands:currency.twentyone.insufficient")
      );
      return;
    }

    const now = Date.now();
    const canPlay = now - 3600000 > data.twentyOnePlayed;

    if (!canPlay) {
      const cooldown = data.twentyOnePlayed - now + 3600000;
      await interaction.editReply({
        content: t("commands:currency.twentyone.cooldown", {
          time: parseSeconds(Math.ceil(cooldown / 1000)),
        }),
      });
      return;
    }

    const gameState = { won: false, over: false };

    let dealer = Math.ceil(Math.random() * 10);
    let player = Math.ceil(Math.random() * 10);

    const gameEmbed = new MessageEmbed();
    gameEmbed.setTitle(t("commands:currency.twentyone.title"));
    gameEmbed.setDescription(t("commands:currency.twentyone.description"));
    gameEmbed.setColor(Becca.colours.default);
    gameEmbed.addField(
      t("commands:currency.twentyone.player"),
      player.toString(),
      true
    );
    gameEmbed.addField(
      t("commands:currency.twentyone.becca"),
      dealer.toString(),
      true
    );

    const hitButton = new MessageButton()
      .setCustomId(t("commands:currency.twentyone.hit"))
      .setEmoji("<:BeccaThumbsup:875129902997860393>")
      .setLabel("Hit")
      .setStyle("SUCCESS");
    const standButton = new MessageButton()
      .setCustomId(t("commands:currency.twentyone.stand"))
      .setEmoji("<:BeccaYikes:877278299066347632>")
      .setLabel("Stand")
      .setStyle("PRIMARY");

    const row = new MessageActionRow().addComponents([hitButton, standButton]);

    const message = (await interaction.editReply({
      embeds: [gameEmbed],
      components: [row],
    })) as Message;

    const collector = message.createMessageComponentCollector({
      filter: (click) => click.user.id === interaction.user.id,
      time: 600000,
    });

    collector.on("collect", async (click) => {
      await click.deferUpdate();
      switch (click.customId) {
        case "hit":
          player += Math.ceil(Math.random() * 10);
          if (player > 21) {
            break;
          }
          if (dealer < 16) {
            dealer += Math.ceil(Math.random() * 10);
          }
          break;
        case "stand":
          while (dealer <= 16) {
            dealer += Math.ceil(Math.random() * 10);
          }
      }
      if (player > 21 || (click.customId === "stand" && dealer > player)) {
        gameState.over = true;
        gameState.won = false;
      }
      if (dealer > 21 || (dealer > 16 && player > dealer && player <= 21)) {
        gameState.over = true;
        gameState.won = true;
      }
      const newHitButton = new MessageButton()
        .setCustomId(t("commands:currency.twentyone.hit"))
        .setEmoji("<:BeccaThumbsup:875129902997860393>")
        .setLabel("Hit")
        .setStyle("SUCCESS");
      const newStandButton = new MessageButton()
        .setCustomId(t("commands:currency.twentyone.stand"))
        .setEmoji("<:BeccaYikes:877278299066347632>")
        .setLabel("Stand")
        .setStyle("PRIMARY");

      if (gameState.over) {
        newHitButton.setDisabled(true);
        newStandButton.setDisabled(true);
        gameEmbed.setTitle(
          gameState.won
            ? t("commands:currency.twentyone.won")
            : t("commands:currency.twentyone.lost")
        );
        data.currencyTotal = gameState.won
          ? data.currencyTotal + wager
          : data.currencyTotal - wager;
        data.twentyOnePlayed = now;
        await data.save();
        gameEmbed.setDescription(
          t("commands:currency.twentyone.total", { total: data.currencyTotal })
        );
        await Becca.currencyHook.send(
          `${interaction.user.username} played 21 in ${
            interaction.guild?.name
          }! They ${gameState.won ? "won" : "lost"} ${wager} BeccaCoin.`
        );
      }

      const newRow = new MessageActionRow().addComponents([
        newHitButton,
        newStandButton,
      ]);

      gameEmbed.setFields(
        {
          name: t("commands:currency.twentyone.player"),
          value: player.toString(),
          inline: true,
        },
        {
          name: t("commands:currency.twentyone.becca"),
          value: dealer.toString(),
          inline: true,
        }
      );

      await interaction.editReply({
        embeds: [gameEmbed],
        components: [newRow],
      });
    });

    collector.on("end", async () => {
      await interaction.editReply({
        content: t("commands:currency.twentyone.expired"),
        embeds: [],
        components: [],
      });

      if (!gameState.over) {
        data.currencyTotal -= wager;
        data.twentyOnePlayed = now;
        await data.save();
        await Becca.currencyHook.send(
          `${interaction.user.username} played 21 in ${interaction.guild?.name}! They timed out and lost ${wager} BeccaCoin.`
        );
      }
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "twenty one command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "twenty one", errorId, t)],
    });
  }
};
