import { optouts } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Fetches or generates an opt-out record for the given user.
 *
 * @param {BeccaLyria} Becca Becca's bot instance.
 * @param {string} userId The user's ID.
 * @returns {Promise<optouts | null>} The opt-out record, or null if an error occurred.
 */
export const getOptOutRecord = async (
  Becca: BeccaLyria,
  userId: string
): Promise<optouts | null> => {
  try {
    const record = await Becca.db.optouts.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
        activity: false,
        emote: false,
        level: false,
        star: false,
        vote: false,
      },
    });
    return record;
  } catch (err) {
    await beccaErrorHandler(Becca, "get opt out record module", err);
    return null;
  }
};
