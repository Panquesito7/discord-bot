import { newlevels } from "@prisma/client";
import { TFunction } from "i18next";

import levelScale from "../../../config/listeners/levelScale";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ValidatedChatInputCommandInteraction } from "../../../interfaces/discord/ValidatedChatInputCommandInteraction";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles adding experience points to a user manually.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ValidatedChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 * @param {newlevels} user The user's level record.
 * @param {number} amount The amount of experience to add.
 */
export const xpModifyAdd = async (
  Becca: BeccaLyria,
  interaction: ValidatedChatInputCommandInteraction,
  t: TFunction,
  user: newlevels,
  amount: number
) => {
  try {
    if (user.level >= 100) {
      await interaction.editReply({
        content: t("commands:manage.xp.max"),
      });
      return;
    }
    user.points += amount;
    while (user.points > levelScale[user.level + 1]) {
      user.level++;
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
