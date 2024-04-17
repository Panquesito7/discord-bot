import { Listener } from "../interfaces/listeners/Listener";
import { sassAmirite } from "../modules/listeners/sass/sassAmirite";
import { sassGreeting } from "../modules/listeners/sass/sassGreeting";
import { sassSorry } from "../modules/listeners/sass/sassSorry";
import { sassThanks } from "../modules/listeners/sass/sassThanks";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const sassListener: Listener = {
  name: "sass",
  description: "Handles Becca's Sassy Mode!",
  run: async (Becca, message, t, config) => {
    try {
      if (config.sass_mode !== "on" || !message.content) {
        return;
      }

      await sassGreeting(Becca, message, t, config);
      await sassAmirite(Becca, message, t, config);
      await sassSorry(Becca, message, t, config);
      await sassThanks(Becca, message, t, config);
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "links listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
