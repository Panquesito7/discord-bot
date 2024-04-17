import { Listener } from "../interfaces/listeners/Listener";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const messageCountListener: Listener = {
  name: "Count Messages",
  description: "Counts the number of messages a user sends in a server.",
  run: async (Becca, message) => {
    try {
      const { author, guild } = message;

      await Becca.db.messagecounts.upsert({
        where: {
          serverId_userId: {
            serverId: guild.id,
            userId: author.id,
          },
        },
        update: {
          messages: {
            increment: 1,
          },
        },
        create: {
          serverId: guild.id,
          userId: author.id,
          messages: 1,
        },
      });
    } catch (err) {
      await beccaErrorHandler(
        Becca,
        "message count listener",
        err,
        message.guild?.name,
        message
      );
    }
  },
};
