import axios from "axios";
import { Message } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner command for flagging new scam domains.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiAntiphish = async (Becca: BeccaLyria, message: Message) => {
  try {
    // Naomi fish <link>
    const [, , link] = message.content.split(" ");

    const walshyResult = await axios.post<{ message: string }>(
      "https://bad-domains.walshy.dev/report",
      { domain: link }
    );

    await message.reply(
      `I have reported that domain! Here's the result:\n${JSON.stringify({
        walshy: walshyResult.data.message,
      })}`
    );
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "naomi antiphish",
      err,
      message.guild?.name,
      message
    );
  }
};
