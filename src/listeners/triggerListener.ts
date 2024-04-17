import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const triggerListener: Listener = {
  name: "triggerListener",
  description: "Handles the logic for a server's triggers.",
  run: async (Becca, message, t, config) => {
    try {
      if (!config.new_triggers?.length) {
        return;
      }

      for (const { trigger, response } of config.new_triggers) {
        if (message.content === trigger) {
          await message.channel.send(response);
          break;
        }
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
