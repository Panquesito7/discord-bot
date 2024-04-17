import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";

/**
 * Checks if the user is a member of Becca's support staff.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {string} userId The ID of the user to look for.
 * @returns {boolean} Whether the member has the configured support staff role.
 */
export const isSupportStaff = async (
  Becca: BeccaLyria,
  userId: string
): Promise<boolean> => {
  try {
    const guild = await FetchWrapper.guild(Becca, Becca.configs.homeGuild);
    if (!guild) {
      return false;
    }
    const member = await FetchWrapper.member(guild, userId);
    return member?.roles.cache.has(Becca.configs.supportRole) ?? false;
  } catch (err) {
    await beccaErrorHandler(Becca, "is support staff", err);
    return false;
  }
};
