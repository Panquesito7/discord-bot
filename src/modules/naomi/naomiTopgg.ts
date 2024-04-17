import axios from "axios";
import { Message } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { getCounts } from "../becca/getCounts";

/**
 * Owner only module to update the guild counts on topgg.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiTopgg = async (Becca: BeccaLyria, message: Message) => {
  try {
    const { guilds } = getCounts(Becca);

    const endpoint = `https://top.gg/api/bots/${Becca.configs.id}/stats`;
    const headers = { Authorization: Becca.configs.topGGToken };

    const response = await axios.post(
      endpoint,
      { server_count: guilds },
      { headers }
    );

    await message.reply(
      `I have updated my server count on top.gg to ${guilds} - The response was ${response.status}`
    );
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "topgg command",
      err,
      message.guild?.name,
      message
    );
  }
};
