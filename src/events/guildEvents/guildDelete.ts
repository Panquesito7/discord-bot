import { Guild, EmbedBuilder } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * Sends a notification to the debug hook when Becca leaves a server. Also cleans up
 * the stored data for that server.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object representing the server Becca was removed from.
 */
export const guildDelete = async (
  Becca: BeccaLyria,
  guild: Guild
): Promise<void> => {
  const owner = await FetchWrapper.member(guild, guild.ownerId);
  const guildDeleteEmbed = new EmbedBuilder();
  guildDeleteEmbed.setTitle(
    `${Becca.user?.username || "Becca Lyria"} has been dismissed from a guild!`
  );
  guildDeleteEmbed.setDescription(
    "It would seem they no longer need my assistance."
  );
  guildDeleteEmbed.addFields([
    {
      name: "Guild Name",
      value: guild.name,
      inline: true,
    },
    {
      name: "Guild Owner",
      value: owner?.user.username || "No owner data available.",
      inline: true,
    },
    {
      name: "Guild ID",
      value: guild.id,
      inline: true,
    },
    {
      name: "Guild Owner ID",
      value: guild.ownerId || "No owner data available",
      inline: true,
    },
  ]);

  guildDeleteEmbed.setColor(Becca.colours.warning);
  guildDeleteEmbed.setTimestamp();

  await Becca.debugHook.send({
    embeds: [guildDeleteEmbed],
    username: Becca.user?.username ?? "Becca",
    avatarURL:
      Becca.user?.displayAvatarURL() ??
      "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png",
  });

  await Becca.db.servers
    .delete({
      where: {
        serverID: guild.id,
      },
    })
    .catch(() => null);
  await Becca.db.newlevels
    .deleteMany({
      where: {
        serverID: guild.id,
      },
    })
    .catch(() => null);
  await Becca.db.starcounts
    .delete({
      where: {
        serverID: guild.id,
      },
    })
    .catch(() => null);
  await Becca.db.histories
    .deleteMany({
      where: {
        serverId: guild.id,
      },
    })
    .catch(() => null);
};
