import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Module to clean up a user's level and star data when
 * they leave a guild.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} userId Discord ID of the user that left the guild.
 * @param {string} guildId Discord ID of the guild the user left.
 */
export const memberRemoveCleanup = async (
  Becca: BeccaLyria,
  userId: string,
  guildId: string
): Promise<void> => {
  try {
    await Becca.db.newlevels
      .delete({
        where: {
          serverID_userID: {
            userID: userId,
            serverID: guildId,
          },
        },
      })
      .catch(() => null);

    const starData = await Becca.db.starcounts.findUnique({
      where: {
        serverID: guildId,
      },
    });

    if (starData) {
      const index = starData.users.findIndex((user) => user.userID === userId);
      if (index !== -1) {
        starData.users.splice(index, 1);
        await Becca.db.starcounts.update({
          where: {
            serverID: guildId,
          },
          data: {
            users: starData.users,
          },
        });
      }
    }

    await Becca.db.messagecounts
      .delete({
        where: {
          serverId_userId: {
            serverId: guildId,
            userId,
          },
        },
      })
      .catch(() => null);
  } catch (error) {
    await beccaErrorHandler(Becca, "member cleanup helper", error);
  }
};
