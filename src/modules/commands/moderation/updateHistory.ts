import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ModerationActions } from "../../../interfaces/commands/moderation/ModerationActions";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { modActionToPlural } from "../../../utils/typeConversions";

/**
 * Saves a count of the user's moderation actions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ModerationActions} action The action taken against the user.
 * @param {string} userId The ID of the user being moderated.
 * @param {string} guildId The ID of the guild the moderation occurred in.
 */
export const updateHistory = async (
  Becca: BeccaLyria,
  action: ModerationActions,
  userId: string,
  guildId: string
) => {
  try {
    const createData = {
      serverId: guildId,
      userId,
      bans: 0,
      kicks: 0,
      mutes: 0,
      unbans: 0,
      unmutes: 0,
      warns: 0,
    };
    createData[modActionToPlural(action)] = 1;
    await Becca.db.histories.upsert({
      where: {
        serverId_userId: {
          serverId: guildId,
          userId,
        },
      },
      update: {
        [modActionToPlural(action)]: {
          increment: 1,
        },
      },
      create: createData,
    });
  } catch (err) {
    await beccaErrorHandler(Becca, "update moderation history", err, guildId);
  }
};
