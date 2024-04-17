import { Message, EmbedBuilder, PartialMessage, ChannelType } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { automodListener } from "../../listeners/automodListener";
import { emoteListener } from "../../listeners/emoteListener";
import { sassListener } from "../../listeners/sassListener";
import { triggerListener } from "../../listeners/triggerListener";
import { sendLogEmbed } from "../../modules/guild/sendLogEmbed";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { generateDiff } from "../../utils/generateDiff";
import { messageHasNecessaryProperties } from "../../utils/typeGuards";

/**
 * Handles the messageUpdate event. Validates that the content in the message
 * changed, then sends an embed with the change details to the log channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Message | PartialMessage} oldMessage Old message object.
 * @param {Message | PartialMessage} newMessage New message object.
 */
export const messageUpdate = async (
  Becca: BeccaLyria,
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage
): Promise<void> => {
  try {
    const message = newMessage.partial
      ? await newMessage.fetch().catch(() => null)
      : newMessage;
    if (
      !message ||
      !messageHasNecessaryProperties(message) ||
      message.channel.type === ChannelType.DM
    ) {
      return;
    }
    const { author, guild, content: newContent } = message;
    const { content: oldContent } = oldMessage;
    const lang = guild.preferredLocale;
    const t = getFixedT(lang);

    const serverConfig = await getSettings(Becca, guild.id, guild.name);

    if (!serverConfig) {
      return;
    }

    if (oldContent && newContent && oldContent === newContent) {
      return;
    }

    if (!author || author.bot) {
      return;
    }

    const diffContent =
      oldContent && newContent
        ? generateDiff(oldContent, newContent)
        : t("events:message.edit.nocont");

    const updateEmbed = new EmbedBuilder();
    updateEmbed.setTitle(t("events:message.edit.title"));
    updateEmbed.setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL(),
    });
    updateEmbed.setDescription(`\`\`\`diff\n${diffContent}\`\`\``);
    updateEmbed.setFooter({
      text: `Author: ${author.id} | Message: ${oldMessage.id}`,
    });
    updateEmbed.setColor(Becca.colours.default);
    updateEmbed.setTimestamp();
    updateEmbed.addFields([
      {
        name: t("events:message.edit.chan"),
        value: `<#${newMessage.channel.id}>`,
      },
      {
        name: t("events:message.edit.link"),
        value: newMessage.url,
      },
    ]);

    await sendLogEmbed(Becca, guild, updateEmbed, "message_events");

    await sassListener.run(Becca, message, t, serverConfig);
    await automodListener.run(Becca, message, t, serverConfig);
    await triggerListener.run(Becca, message, t, serverConfig);
    await emoteListener.run(Becca, message, t, serverConfig);
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "message update event",
      err,
      oldMessage.guild?.name
    );
  }
};
