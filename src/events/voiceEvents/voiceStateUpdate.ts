import { EmbedBuilder, VoiceState } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Logs when a member's voice state changes (such as they enter a voice channel,
 * leave a voice channel, or move between voice channels).
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {VoiceState} oldState The member's voice state before the update.
 * @param {VoiceState} newState The member's voice state after the update.
 */
export const voiceStateUpdate = async (
  Becca: BeccaLyria,
  oldState: VoiceState,
  newState: VoiceState
): Promise<void> => {
  try {
    const lang = oldState.guild.preferredLocale;
    const t = getFixedT(lang);
    const voiceEmbed = new EmbedBuilder();
    voiceEmbed.setTimestamp();
    voiceEmbed.setFooter({ text: `ID: ${oldState.id}` });
    const userId = `<@!${oldState.id}>`;
    const oldId = `<#${oldState.channelId}>`;
    const newId = `<#${newState.channelId}>`;

    if (
      oldState.channelId &&
      newState.channelId &&
      oldState.channelId !== newState.channelId
    ) {
      voiceEmbed.setTitle(t("events:voice.move.title"));
      voiceEmbed.setDescription(
        t("events:voice.move.desc", {
          userId,
          oldId,
          newId,
        })
      );
      voiceEmbed.setColor(Becca.colours.warning);
    }

    if (oldState.channelId && !newState.channelId) {
      voiceEmbed.setTitle(t("events:voice.leave.title"));
      voiceEmbed.setDescription(
        t("events:voice.leave.desc", {
          userId,
          oldId,
        })
      );
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (!oldState.channelId && newState.channelId) {
      voiceEmbed.setTitle(t("events:voice.join.title"));
      voiceEmbed.setDescription(
        t("events:voice.join.desc", {
          userId,
          newId,
        })
      );
      voiceEmbed.setColor(Becca.colours.success);
    }

    if (!oldState.mute && newState.mute) {
      voiceEmbed.setTitle(t("events:voice.mute.title"));
      voiceEmbed.setDescription(t("events:voice.mute.desc", { userId }));
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (oldState.mute && !newState.mute) {
      voiceEmbed.setTitle(t("events:voice.unmute.title"));
      voiceEmbed.setDescription(t("events:voice.unmute.desc", { userId }));
      voiceEmbed.setColor(Becca.colours.success);
    }

    if (!oldState.deaf && newState.deaf) {
      voiceEmbed.setTitle(t("events:voice.deafen.title"));
      voiceEmbed.setDescription(t("events:voice.deafen.desc", { userId }));
      voiceEmbed.setColor(Becca.colours.error);
    }

    if (oldState.deaf && !newState.deaf) {
      voiceEmbed.setTitle(t("events:voice.undeafen.title"));
      voiceEmbed.setDescription(t("events:voice.undeafen.desc", { userId }));
      voiceEmbed.setColor(Becca.colours.success);
    }

    if (voiceEmbed.data.description) {
      await sendLogEmbed(Becca, oldState.guild, voiceEmbed, "voice_events");
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "voice state update listener", err);
  }
};
