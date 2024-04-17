import { ListenerHandler } from "../../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Submodule for amirite comebacks.
 */
export const sassGreeting: ListenerHandler = async (Becca, message, t) => {
  try {
    const { channel, content } = message;

    const greetingRegex =
      /good\s(morning|afternoon|evening|night|day)|morning\severyone/i;
    if (greetingRegex.test(content) || content.toLowerCase() === "morning") {
      await channel.send(tFunctionArrayWrapper(t, "sass:greeting"));
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "greeting sassListener",
      err,
      message.guild?.name,
      message
    );
  }
};
