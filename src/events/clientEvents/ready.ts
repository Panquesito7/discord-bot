import { EmbedBuilder } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { loadEvents } from "../../modules/events/scheduledEvent";
import { beccaLogHandler } from "../../utils/beccaLogHandler";

/**
 * Sends a notification to the debug hook when Becca has connected to
 * Discord and is ready to receive events.
 *
 * @param {BeccaLyria} Becca Becca's Client instance.
 */
export const ready = async (Becca: BeccaLyria): Promise<void> => {
  beccaLogHandler.log("debug", "Fetching reaction role data...");
  const readyEmbed = new EmbedBuilder();
  readyEmbed.setTitle("Becca is online");
  readyEmbed.setDescription(
    `${Becca.user?.username || "Becca Lyria"} has come online.`
  );
  readyEmbed.setTimestamp();
  readyEmbed.setColor(Becca.colours.success);
  readyEmbed.setFooter({ text: `Version ${Becca.configs.version}` });

  await Becca.debugHook.send({
    embeds: [readyEmbed],
    username: Becca.user?.username ?? "Becca",
    avatarURL:
      Becca.user?.displayAvatarURL() ??
      "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png",
  });
  beccaLogHandler.log("debug", "Discord ready!");

  await loadEvents(Becca);
  beccaLogHandler.log("debug", "Loaded scheduled events!");

  await Becca.debugHook.send({
    content: "Boot Process Complete~!",
    username: Becca.user?.username ?? "Becca",
    avatarURL:
      Becca.user?.displayAvatarURL() ??
      "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png",
  });
};
