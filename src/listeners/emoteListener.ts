import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const emoteListener: Listener = {
  name: "emoteListener",
  description: "Handles the logic for emote-only channels.",
  run: async (Becca, message, t, config) => {
    try {
      if (!config.emote_channels?.includes(message.channel.id)) {
        return;
      }

      if (!message.content) {
        await message.delete();
        return;
      }

      if (message.attachments.size > 0) {
        await message.delete();
        return;
      }

      const newContent = message.content
        ?.replace(/<a?:.+?:\d{17,19}>|\p{Extended_Pictographic}/gu, "")
        .replace(/\s/g, "");

      if (newContent?.length) {
        await message.delete();
        return;
      }
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "trigger listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
