import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { BotActivity } from "../../interfaces/listeners/BotActivity";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { botActivityToPlural } from "../../utils/typeConversions";
import { getOptOutRecord } from "../listeners/getOptOutRecord";

/**
 * Provided the user has not opted out from bot activity tracking, this fetches or
 * creates the user's activity record from the database. Then it increments the counter
 * for the type of activity passed in, and saves the record.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} user The Discord ID for the user to update.
 * @param {BotActivity} activity The type of activity to increase the count for.
 */
export const logActivity = async (
  Becca: BeccaLyria,
  user: string,
  activity: BotActivity
): Promise<void> => {
  try {
    const optout = await getOptOutRecord(Becca, user);

    if (!optout || optout.activity) {
      return;
    }

    const createData = {
      userId: user,
      buttons: 0,
      commands: 0,
      selects: 0,
      contexts: 0,
    };
    createData[botActivityToPlural(activity)] = 1;

    await Becca.db.activities.upsert({
      where: {
        userId: user,
      },
      update: {
        [botActivityToPlural(activity)]: {
          increment: 1,
        },
      },
      create: createData,
    });
  } catch (err) {
    await beccaErrorHandler(Becca, "activity logger", err);
  }
};
