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
 * Sends the log embed when a guild member changes their nickname.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember | PartialGuildMember} oldMember The member's state before the update.
 * @param {GuildMember} newMember The member's state after the update.
 * @param {EmbedBuilder} embed The partially constructed embed.
 * @param {TFunction} t Translation function.
 * @param {GuildTextBasedChannel} logChannel The channel to send the embed in.
 */
export const memberNicknameChange = async (
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
        key: "nickname",
      })
    );
    embed.addFields([
      {
        name: t("events:member.update.old"),
        value: oldMember.nickname || oldMember.user.username,
        inline: true,
      },
      {
        name: t("events:member.update.new"),
        value: newMember.nickname || newMember.user.username,
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
