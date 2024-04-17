import { newlevels } from "@prisma/client";
import { TFunction } from "i18next";

import levelScale from "../../../config/listeners/levelScale";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ValidatedChatInputCommandInteraction } from "../../../interfaces/discord/ValidatedChatInputCommandInteraction";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles removing experience points from a user manually.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ValidatedChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 * @param {newlevels} user The user's level record.
 * @param {number} amount The amount of experience to remove.
 */
export const xpModifyRemove = async (
  Becca: BeccaLyria,
  interaction: ValidatedChatInputCommandInteraction,
  t: TFunction,
  user: newlevels,
  amount: number
) => {
  try {
    if (user.points - amount <= 0) {
      await interaction.editReply({
        content: t("commands:manage.xp.min"),
      });
      return;
    }
    user.points -= amount;
    while (user.points <= levelScale[user.level]) {
      user.level--;
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "xp modify add command",
      err,
      interaction.guild.name
    );
  }
};
