import {
  AutoModerationActionExecution,
  AutoModerationActionType,
  EmbedBuilder,
} from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { updateHistory } from "../../modules/commands/moderation/updateHistory";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * Handles automod execution events.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {AutoModerationActionExecution} action The action payload.
 */
export const autoModerationActionExecution = async (
  Becca: BeccaLyria,
  action: AutoModerationActionExecution
) => {
  try {
    if (action.action.type !== AutoModerationActionType.Timeout) {
      return;
    }

    await updateHistory(Becca, "mute", action.userId, action.guild.id);

    const settings = await getSettings(
      Becca,
      action.guild.id,
      action.guild.name
    );

    if (!settings?.moderation_events) {
      return;
    }

    const channel = await FetchWrapper.channel(
      action.guild,
      settings.moderation_events
    );

    if (!channel?.isTextBased()) {
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Automod mute detected");
    embed.setDescription(
      `The user <@!${action.userId}>'s history has been updated.`
    );
    await channel.send({ embeds: [embed] });
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "auto moderation action execution event",
      err,
      action.guild.name
    );
  }
};
