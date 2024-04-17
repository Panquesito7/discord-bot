import {
  ChannelType,
  Embed,
  EmbedBuilder,
  Guild,
  TextChannel,
} from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { Settings } from "../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getSettings } from "../settings/getSettings";

/**
 * Validates that the server has set a log channel, confirms the channel still exists,
 * and sends the provided content embed to that channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object.
 * @param {EmbedBuilder} content The MessageEmbed to send to the log channel.
 * @param {Settings} channel The log channel option to look for.
 */
export const sendLogEmbed = async (
  Becca: BeccaLyria,
  guild: Guild,
  content: EmbedBuilder | Embed,
  channel: Settings
): Promise<void> => {
  try {
    const guildChannelSetting = (
      await getSettings(Becca, guild.id, guild.name)
    )?.[channel];

    if (!guildChannelSetting) {
      return;
    }

    const logsChannel = guild.channels.cache.find(
      (chan) =>
        chan.id === guildChannelSetting && chan.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (!logsChannel) {
      return;
    }

    await logsChannel.send({ embeds: [content] });
  } catch (err) {
    await beccaErrorHandler(Becca, "send log embed module", err, guild.name);
  }
};
