import { scheduledevents } from "@prisma/client";
import { ChannelType } from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";

const createTimeout = (
  Becca: BeccaLyria,
  { member, targetChannel, lang, message, time, id }: scheduledevents
) => {
  Becca.timeOuts[id] = setTimeout(async () => {
    const channel = await Becca.channels.fetch(targetChannel).catch(() => null);
    const t = getFixedT(lang);
    if (
      channel?.type === ChannelType.GuildText ||
      channel?.type === ChannelType.GuildAnnouncement
    ) {
      await channel.send({
        content: t("commands:community.schedule.post", {
          id: `<@${member}>`,
          message,
        }),
        allowedMentions: {
          users: [member],
        },
      });
    }
    await Becca.db.scheduledevents.delete({
      where: {
        member_targetChannel: {
          member,
          targetChannel,
        },
      },
    });
    delete Becca.timeOuts[id];
  }, time - Date.now());
};

/**
 *
 * @param {BeccaLyria} Becca Current running Becca instance.
 * @param {scheduledevents} rawEvent Raw scheduled event data to be placed into the database and the scheduler.
 */
export const createEvent = async (
  Becca: BeccaLyria,
  rawEvent: Omit<scheduledevents, "id">
) => {
  const dbEvent = await Becca.db.scheduledevents.create({
    data: rawEvent,
  });
  createTimeout(Becca, dbEvent);
};

/**
 *
 * @param {BeccaLyria} Becca Current running Becca instance.
 */
export const loadEvents = async (Becca: BeccaLyria) => {
  const events = await Becca.db.scheduledevents.findMany();
  for (const event of events) {
    if (Date.now() > event.time) {
      await Becca.db.scheduledevents.delete({
        where: {
          member_targetChannel: {
            member: event.member,
            targetChannel: event.targetChannel,
          },
        },
      });
    } else {
      createTimeout(Becca, event);
    }
  }
};
