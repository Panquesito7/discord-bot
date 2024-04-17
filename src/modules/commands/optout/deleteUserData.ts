import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { OptOutSettings } from "../../../interfaces/settings/OptOutSettings";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

import { deletionFunctions } from "./deletionFunctions";

/**
 * Module to delete all of a user's data associated with a specific feature.
 *
 * @param {BeccaLyria} Becca Becca's Discord bot instance.
 * @param {string} userId The ID of the user to clean up.
 * @param {OptOutSettings} type The type of data to clean up.
 * @returns {boolean} Whether or not the data was deleted.
 */
export const deleteUserData = async (
  Becca: BeccaLyria,
  userId: string,
  type: OptOutSettings
): Promise<boolean> => {
  try {
    await deletionFunctions[type](Becca, userId);
    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "delete user data module", err);
    return false;
  }
};
