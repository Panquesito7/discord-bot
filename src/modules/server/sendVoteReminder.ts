import { voters } from "@prisma/client";
import { WebhookPayload } from "@top-gg/sdk";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * A module to send a vote reminder message to a given channel.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {WebhookPayload} payload The vote payload from Top.gg.
 * @param {voters} voter The user's database record.
 * @param {string} type The type of vote - either "bot" or "server".
 */
export const sendVoteReminder = async (
  Becca: BeccaLyria,
  payload: WebhookPayload,
  voter: voters,
  type: "bot" | "server" | "unknown"
): Promise<void> => {
  try {
    if (type === "unknown") {
      return;
    }
    const guild = await FetchWrapper.guild(Becca, Becca.configs.homeGuild);
    const channel = await FetchWrapper.channel(
      guild,
      Becca.configs.voteChannel
    );

    if (!channel?.isTextBased()) {
      return;
    }

    const message = `Hey <@!${
      payload.user
    }>! It's time to vote for the ${type} on top.gg again!\n\nYou can vote here: <${
      type === "server"
        ? "https://top.gg/servers/778130114772598785/vote"
        : "https://top.gg/bot/716707753090875473/vote"
    }>`;

    await channel.send({ content: message });
  } catch (err) {
    await beccaErrorHandler(Becca, "send vote reminder", err);
  }
};
