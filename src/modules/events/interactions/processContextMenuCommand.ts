import { ContextMenuCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { contextCommandHasNecessaryProperties } from "../../../utils/typeGuards";
import { logActivity } from "../../commands/logActivity";
import { getSettings } from "../../settings/getSettings";

/**
 * Handles the logic for context menu commands (right click).
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {ContextMenuCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const processContextMenuCommand = async (
  Becca: BeccaLyria,
  interaction: ContextMenuCommandInteraction,
  t: TFunction
) => {
  try {
    await logActivity(Becca, interaction.user.id, "context");
    const target = Becca.contexts.find(
      (el) => el.data.name === interaction.commandName
    );
    if (!target) {
      interaction.reply({
        content: t<string, string>("events:interaction.bad", {
          command: interaction.commandName,
        }),
      });
      return;
    }
    if (!contextCommandHasNecessaryProperties(interaction)) {
      await interaction.reply({
        content: t<string, string>("events:interaction.noDms"),
      });
      return;
    }
    const config = await getSettings(
      Becca,
      interaction.guildId,
      interaction.guild.name
    );
    if (!config) {
      await interaction.reply({
        content: t<string, string>("events:interaction.noSettings"),
      });
      return;
    }
    await target.run(Becca, interaction, t, config);
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "process chat input command",
      err,
      interaction.guild?.name
    );
  }
};
