import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { OptOutSettings } from "../../../interfaces/settings/OptOutSettings";

const deleteActivity = async (Becca: BeccaLyria, userId: string) => {
  await Becca.db.activities.deleteMany({
    where: {
      userId,
    },
  });
};

const deleteEmote = async (Becca: BeccaLyria, userId: string) => {
  await Becca.db.emotecounts.deleteMany({
    where: {
      userId,
    },
  });
};

const deleteLevel = async (Becca: BeccaLyria, userId: string) => {
  await Becca.db.newlevels.deleteMany({
    where: {
      userID: userId,
    },
  });
};

const deleteStar = async (Becca: BeccaLyria, userId: string) => {
  const stars = await Becca.db.starcounts.findMany();
  for (const star of stars) {
    const userIndex = star.users.findIndex((obj) => obj.userID === userId);
    if (userIndex !== -1) {
      star.users.splice(userIndex, 1);
      await Becca.db.starcounts.update({
        where: {
          serverID: star.serverID,
        },
        data: star,
      });
    }
  }
};

const deleteVote = async (Becca: BeccaLyria, userId: string) => {
  await Becca.db.voters.deleteMany({
    where: {
      userId,
    },
  });
};

export const deletionFunctions: {
  [key in OptOutSettings]: (Becca: BeccaLyria, userId: string) => Promise<void>;
} = {
  activity: deleteActivity,
  emote: deleteEmote,
  level: deleteLevel,
  star: deleteStar,
  vote: deleteVote,
};
