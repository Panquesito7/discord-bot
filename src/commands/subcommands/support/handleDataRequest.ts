import { AttachmentBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const userFields = [
  "activities",
  "currencies",
  "emotecounts",
  "messagecounts",
  "newlevels",
  "optouts",
  "starcounts",
  "userconfigs",
  "voters",
  "scheduledevents",
];

const ownerFields = ["histories", "polls", "server"];

/**
 * Returns user-related data from the database, in the form of an attachment.
 */
export const handleDataRequest: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { user, guild } = interaction;
    const obj = (
      await Promise.allSettled([
        Becca.db.activities.findUnique({
          where: { userId: user.id },
        }),
        Becca.db.currencies.findUnique({
          where: { userId: user.id },
        }),
        Becca.db.emotecounts.findUnique({
          where: { userId: user.id },
        }),
        Becca.db.messagecounts.findMany({
          where: { userId: user.id },
        }),
        Becca.db.newlevels.findMany({
          where: { userID: user.id },
        }),
        Becca.db.optouts.findUnique({
          where: { userId: user.id },
        }),
        Becca.db.starcounts.findMany({
          where: {
            users: {
              some: {
                userID: user.id,
              },
            },
          },
        }),
        Becca.db.userconfigs.findUnique({
          where: { userId: user.id },
        }),
        Becca.db.voters.findUnique({
          where: { userId: user.id },
        }),
        Becca.db.scheduledevents.findMany({
          where: {
            member: user.id,
          },
        }),
      ])
    ).reduce((acc, cur, index) => {
      if (cur.status === "fulfilled") {
        if (cur.value) {
          if ("id" in cur.value) {
            // @ts-expect-error Delete the ID field, since it shouldn't be exposed to the user.
            delete cur.value.id;
          }
          if ("users" in cur.value) {
            cur.value.users = (cur.value.users as { userID: string }[]).filter(
              (e) => e.userID === user.id
            );
          }
          acc[userFields[index]] = cur.value;
        } else {
          acc[userFields[index]] = {};
        }
      } else {
        throw cur.reason;
      }
      return acc;
    }, {} as Record<string, unknown>);
    if (guild && user.id === guild.ownerId) {
      (
        await Promise.allSettled([
          Becca.db.histories.findMany({
            where: { serverId: guild.id },
          }),
          Becca.db.polls.findMany({
            where: { serverId: guild.id },
          }),
          Becca.db.servers.findUnique({
            where: { serverID: guild.id },
          }),
        ])
      ).forEach((cur, index) => {
        if (cur.status === "fulfilled") {
          if (cur.value) {
            if ("id" in cur.value) {
              // @ts-expect-error Delete the ID field, since it shouldn't be exposed to the user.
              delete cur.value.id;
            }
            obj[ownerFields[index]] = cur.value;
          } else {
            obj[ownerFields[index]] = {};
          }
        } else {
          throw cur.reason;
        }
      });
    }
    const attachment = new AttachmentBuilder(Buffer.from(JSON.stringify(obj)), {
      name: `${user.id}.json`,
    });
    await interaction.editReply({
      content: `Here's your data. If you wish to have your data deleted, visit our support server.\n\n${t(
        "commands:support.server.response"
      )}`,
      files: [attachment],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handle server",
      err,
      interaction.guild?.id,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "server", errorId, t)],
    });
  }
};
