import { ChatInputCommandInteraction } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { usageListener } from "../../../listeners/usageListener";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";
import { chatInputCommandHasNecessaryProperties } from "../../../utils/typeGuards";
import { logActivity } from "../../commands/logActivity";
import { getSettings } from "../../settings/getSettings";

/**
 * Handles the logic for slash commands.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {ChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export const processChatInputCommand = async (
  Becca: BeccaLyria,
  interaction: ChatInputCommandInteraction,
  t: TFunction
) => {
  try {
    await logActivity(Becca, interaction.user.id, "command");
    const target = Becca.commands.find(
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
    if (!chatInputCommandHasNecessaryProperties(interaction)) {
      await interaction.reply({
        content: tFunctionArrayWrapper(t, "responses:missingGuild"),
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
    await usageListener.run(Becca, interaction);
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "process chat input command",
      err,
      interaction.guild?.name
    );
  }
};
