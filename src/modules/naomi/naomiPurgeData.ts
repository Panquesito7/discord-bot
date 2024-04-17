import { Message } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner-only module to purge user data from the database.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiPurgeData = async (Becca: BeccaLyria, message: Message) => {
  try {
    // Naomi purge <data> <id>
    const [, , data, target] = message.content.split(" ");

    if (data === "levels") {
      await Becca.db.newlevels.deleteMany({
        where: { userID: target },
      });

      await message.reply(`I have cleared the level data for ${target}.`);
      return;
    }

    if (data === "activity") {
      await Becca.db.activities.delete({
        where: { userId: target },
      });
      await message.reply(`I have cleared the activity data for ${target}.`);
      return;
    }

    if (data === "stars") {
      const stars = await Becca.db.starcounts.findMany();
      for (const datum of stars) {
        const index = datum.users.findIndex((u) => u.userID === target);
        if (index !== -1) {
          datum.users.splice(index, 1);
          await Becca.db.starcounts.update({
            where: {
              serverID: datum.serverID,
            },
            data: {
              users: datum.users,
            },
          });
        }
      }
      await message.reply(`I have cleared the star data for ${target}.`);
      return;
    }

    if (data === "votes") {
      await Becca.db.voters.delete({
        where: {
          userId: target,
        },
      });
      await message.reply(`I have cleared the vote data for ${target}.`);
      return;
    }

    if (data === "emotes") {
      await Becca.db.emotecounts.delete({
        where: {
          userId: target,
        },
      });
      await message.reply(`I have cleared the emote data for ${target}.`);
      return;
    }

    await message.reply(`${data} is not a valid option.`);
    return;
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "purge command",
      err,
      message.guild?.name,
      message
    );
  }
};
