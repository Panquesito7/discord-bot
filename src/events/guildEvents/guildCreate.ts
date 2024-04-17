import { Guild, EmbedBuilder } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * Generates an embed when Becca joins a guild and sends it to the debug hook.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Guild} guild The guild object for the server Becca joined.
 */
export const guildCreate = async (
  Becca: BeccaLyria,
  guild: Guild
): Promise<void> => {
  const owner = await FetchWrapper.member(guild, guild.ownerId);
  const guildCreateEmbed = new EmbedBuilder();
  guildCreateEmbed.setTitle(
    `${Becca.user?.username || "Becca Lyria"} has been enlisted in a new guild!`
  );
  guildCreateEmbed.setDescription(
    "It would seem they have need of my services."
  );
  guildCreateEmbed.addFields([
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
  guildCreateEmbed.setColor(Becca.colours.success);
  guildCreateEmbed.setTimestamp();

  await Becca.debugHook.send({
    embeds: [guildCreateEmbed],
    username: Becca.user?.username ?? "Becca",
    avatarURL:
      Becca.user?.displayAvatarURL() ??
      "https://cdn.nhcarrigan.com/avatars/nhcarrigan.png",
  });
};
