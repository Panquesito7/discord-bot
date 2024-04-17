import {
  EmbedBuilder,
  GuildMember,
  GuildTextBasedChannel,
  PartialGuildMember,
} from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Sends the log embed when a guild member changes their roles.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember | PartialGuildMember} oldMember The member's state before the update.
 * @param {GuildMember} newMember The member's state after the update.
 * @param {EmbedBuilder} embed The partially constructed embed.
 * @param {TFunction} t Translation function.
 * @param {GuildTextBasedChannel} logChannel The channel to send the embed in.
 */
export const memberRolesChange = async (
  Becca: BeccaLyria,
  oldMember: GuildMember | PartialGuildMember,
  newMember: GuildMember,
  embed: EmbedBuilder,
  t: TFunction,
  logChannel: GuildTextBasedChannel
) => {
  try {
    embed.setDescription(
      t("events:member.update.description", {
        key: "roles",
      })
    );

    const addedRoles = newMember.roles.cache
      .filter((role) => !oldMember.roles.cache.has(role.id))
      .map((role) => `<@&${role.id}>`);
    const removedRoles = oldMember.roles.cache
      .filter((role) => !newMember.roles.cache.has(role.id))
      .map((role) => `<@&${role.id}>`);

    embed.addFields([
      {
        name: t("events:member.update.old"),
        value: removedRoles.join(", ") || "No roles removed.",
        inline: true,
      },
      {
        name: t("events:member.update.new"),
        value: addedRoles.join(", ") || "No roles added.",
        inline: true,
      },
    ]);

    await logChannel.send({ embeds: [embed] });
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member nickname change module",
      err,
      newMember.guild.name
    );
  }
};
