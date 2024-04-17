import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Listens for messages that mention Becca. Responds to those
 * messages with instructions for using the new commands.
 */
export const beccaMentionListener: Listener = {
  name: "Becca Mention Listener",
  description: "Listens for Becca being mentioned.",
  run: async (Becca, message, t) => {
    try {
      const { channel, mentions } = message;
      if (!Becca.user || !mentions.users?.has(Becca.user.id)) {
        return;
      }

      await message.react(Becca.configs.think).catch(async () => {
        await message.react("🤔");
      });
      await channel.send(t("listeners:becca.response"));
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "mention listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
