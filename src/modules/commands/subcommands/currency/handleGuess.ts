/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Generates a random number between 1 and 100. If the user's `guess` matches that number,
 * increases their currency by `wager`. Otherwise, decreases it.
 */
export const handleGuess: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const wager = interaction.options.getInteger("wager", true);
    const guess = interaction.options.getInteger("guess", true);

    if (wager > data.currencyTotal) {
      await interaction.editReply(t("commands:currency.guess.insufficient"));
      return;
    }

    const becca = Math.ceil(Math.random() * 100);
    const won = guess === becca;

    if (won) {
      data.currencyTotal += wager;
    } else {
      data.currencyTotal -= wager;
    }

    await data.save();

    const embed = new MessageEmbed();
    embed.setTitle(
      won ? t("commands:currency.guess.won") : t("commands:currency.guess.lost")
    );
    embed.setColor(won ? Becca.colours.success : Becca.colours.error);
    embed.setDescription(
      t("commands:currency.guess.total", { total: data.currencyTotal })
    );
    embed.addField(t("commands:currency.guess.guess"), guess.toString(), true);
    embed.addField(t("commands:currency.guess.becca"), becca.toString(), true);
    embed.setFooter({
      text: t("defaults:donate"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent.png",
    });

    await interaction.editReply({ embeds: [embed] });

    await Becca.currencyHook.send(
      `${interaction.user.username} played guess in ${
        interaction.guild?.name
      }! They ${won ? "won" : "lost"} ${wager} BeccaCoin.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "guess command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "guess", errorId, t)],
    });
  }
};
