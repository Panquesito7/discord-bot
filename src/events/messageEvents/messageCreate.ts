import { ChannelType, Message } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { automodPhish } from "../../listeners/automod/automodPhish";
import { automodListener } from "../../listeners/automodListener";
import { beccaMentionListener } from "../../listeners/beccaMentionListener";
import { emoteListener } from "../../listeners/emoteListener";
import { heartsListener } from "../../listeners/heartsListener";
import { levelListener } from "../../listeners/levelListener";
import { messageCountListener } from "../../listeners/messageCountListener";
import { sassListener } from "../../listeners/sassListener";
import { triggerListener } from "../../listeners/triggerListener";
import { runNaomiCommands } from "../../modules/events/runNaomiCommands";
import { getSettings } from "../../modules/settings/getSettings";
import { logTicketMessage } from "../../modules/tickets/logTicketMessage";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getMessageLanguage } from "../../utils/getLangCode";
import { messageHasNecessaryProperties } from "../../utils/typeGuards";

/**
 * Handles the onMessage event. Validates that the message did not come from
 * another bot, then passes the message through to the listeners and command handler.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Message} message The message object received in the gateway event.
 */
export const messageCreate = async (
  Becca: BeccaLyria,
  message: Message
): Promise<void> => {
  try {
    if (message.author.bot) {
      return;
    }

    if (
      !messageHasNecessaryProperties(message) ||
      message.channel.type === ChannelType.DM
    ) {
      return;
    }
    const { channel, guild } = message;
    const lang = getMessageLanguage(message);
    const t = getFixedT(lang);

    const serverConfig = await getSettings(Becca, guild.id, guild.name);

    if (!serverConfig) {
      return;
    }

    if (
      channel.name.startsWith("ticket-") &&
      channel.parent?.id === serverConfig.ticket_category
    ) {
      await logTicketMessage(Becca, guild.id, channel.id, message);
    }

    const isScam = await automodPhish(Becca, message, t, serverConfig);

    if (isScam) {
      return;
    }

    await heartsListener.run(Becca, message, t, serverConfig);
    await automodListener.run(Becca, message, t, serverConfig);
    await levelListener.run(Becca, message, t, serverConfig);
    await sassListener.run(Becca, message, t, serverConfig);
    await triggerListener.run(Becca, message, t, serverConfig);
    await emoteListener.run(Becca, message, t, serverConfig);
    await messageCountListener.run(Becca, message, t, serverConfig);
    await beccaMentionListener.run(Becca, message, t, serverConfig);

    if (
      message.author.id === Becca.configs.ownerId &&
      message.content.startsWith("~Naomi")
    ) {
      await runNaomiCommands(Becca, message);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "message send event",
      err,
      message.guild?.name,
      message
    );
  }
};
