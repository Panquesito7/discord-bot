/* eslint-disable jsdoc/require-param */
import { MessageEmbed } from "discord.js";

import { slotsList } from "../../../../config/commands/slotsList";
import { CurrencyHandler } from "../../../../interfaces/commands/CurrencyHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { parseSeconds } from "../../../../utils/parseSeconds";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Confirms that the user has not used this command within the last hour, then
 * selects three random emotes from the slotsList. If the three emotes match, increases
 * the user's currency by `wager`. Otherwise, decreases it.
 */
export const handleSlots: CurrencyHandler = async (
  Becca,
  interaction,
  t,
  data
) => {
  try {
    const wager = interaction.options.getInteger("wager");

    if (!wager || wager < 1) {
      await interaction.editReply(t("commands:currency.slots.nowager"));
      return;
    }

    if (wager > data.currencyTotal) {
      await interaction.editReply(t("commands:currency.slots.insufficient"));
      return;
    }

    const now = Date.now();
    const canPlay = now - 3600000 > data.slotsPlayed;

    if (!canPlay) {
      const cooldown = data.slotsPlayed - now + 3600000;
      await interaction.editReply({
        content: t("commands:currency.slots.cooldown", {
          time: parseSeconds(Math.ceil(cooldown / 1000)),
        }),
      });
      return;
    }

    const first = slotsList[Math.floor(Math.random() * slotsList.length)];
    const second = slotsList[Math.floor(Math.random() * slotsList.length)];
    const third = slotsList[Math.floor(Math.random() * slotsList.length)];

    const didWin = first === second && second === third;

    data.currencyTotal = didWin
      ? data.currencyTotal + wager
      : data.currencyTotal - wager;
    data.slotsPlayed = now;
    await data.save();

    const slotEmbed = new MessageEmbed();
    slotEmbed.setTitle(
      didWin
        ? t("commands:currency.slots.won")
        : t("commands:currency.slots.lost")
    );
    slotEmbed.setColor(didWin ? Becca.colours.success : Becca.colours.error);
    slotEmbed.setDescription(
      t("commands:currency.slots.total", { total: data.currencyTotal })
    );
    slotEmbed.setFooter(t("commands:currency.slots.footer"));

    await interaction.editReply({
      content: `${first} ${second} ${third}`,
      embeds: [slotEmbed],
    });

    await Becca.currencyHook.send(
      `${interaction.user.username} played slots in ${
        interaction.guild?.name
      }! They ${didWin ? "won" : "lost"} ${wager} BeccaCoin.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "slots command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "slots", errorId, t)],
    });
  }
};
