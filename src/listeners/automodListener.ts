import { PermissionFlagsBits } from "discord.js";

import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

import { automodLinks } from "./automod/automodLinks";
import { automodProfanity } from "./automod/automodProfanity";

/**
 * Checks if the message content includes a link, and confirms that link
 * has not been set as allowed and the user does not have a link-permitted role.
 *
 * If the message fails these conditions, Becca deletes it. Requires that this listener
 * be enabled in the server AND channel.
 */
export const automodListener: Listener = {
  name: "automod",
  description: "Handles the automod logic",
  run: async (Becca, message, t, config) => {
    try {
      if (
        !config.automod_channels.includes(message.channel.id) &&
        !config.automod_channels.includes("all")
      ) {
        return;
      }

      if (config.no_automod_channels.includes(message.channel.id)) {
        return;
      }

      if (
        config.no_automod_channels.includes("all") &&
        !config.automod_channels.includes(message.channel.id)
      ) {
        return;
      }

      if (message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
        return;
      }

      if (config.links === "on") {
        await automodLinks(Becca, message, t, config);
      }

      if (config.profanity === "on") {
        await automodProfanity(Becca, message, t, config);
      }
    } catch (error) {
      await beccaErrorHandler(
        Becca,
        "automod listener",
        error,
        message.guild?.name,
        message
      );
    }
  },
};
