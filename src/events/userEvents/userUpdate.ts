import {
  EmbedBuilder,
  PermissionFlagsBits,
  PartialUser,
  User,
} from "discord.js";
import { getFixedT } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { getSettings } from "../../modules/settings/getSettings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../utils/FetchWrapper";

/**
 * Handles the userUpdate event. Necessary for avatar and username changes.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {User | PartialUser} oldUser The user's state before the update.
 * @param {User} newUser The user's state after the update.
 */
export const userUpdate = async (
  Becca: BeccaLyria,
  oldUser: User | PartialUser,
  newUser: User
): Promise<void> => {
  try {
    const guilds = Becca.guilds.cache.values();
    for (const guild of guilds) {
      const member = await FetchWrapper.member(guild, newUser.id);

      if (!member) {
        continue;
      }

      const lang = guild.preferredLocale;
      const t = getFixedT(lang);
      const serverSettings = await getSettings(Becca, guild.id, guild.name);

      if (!serverSettings?.member_events) {
        continue;
      }

      const logChannel = await FetchWrapper.channel(
        guild,
        serverSettings.member_events
      );
      const beccaMember = await FetchWrapper.becca(Becca, guild);

      if (
        !logChannel?.isTextBased() ||
        !beccaMember
          ?.permissionsIn(logChannel)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        continue;
      }

      const embed = new EmbedBuilder();
      embed.setColor(Becca.colours.default);
      embed.setTitle(t("events:member.update.title"));
      embed.setAuthor({
        name: newUser.tag,
        iconURL: newUser.displayAvatarURL(),
      });
      embed.setFooter({ text: `ID: ${newUser.id}` });
      embed.setTimestamp();

      if (oldUser.tag !== newUser.tag) {
        embed.setDescription(
          t("events:member.update.description", {
            key: "username",
          })
        );
        embed.addFields([
          {
            name: t("events:member.update.old"),
            value: oldUser.tag || "unknown",
            inline: true,
          },
          {
            name: t("events:member.update.new"),
            value: newUser.tag,
            inline: true,
          },
        ]);

        await logChannel.send({ embeds: [embed] });
      }

      if (oldUser.avatar !== newUser.avatar) {
        embed.setDescription(
          t("events:member.update.description", {
            key: "avatar",
          })
        );
        embed.addFields([
          {
            name: t("events:member.update.old"),
            value:
              `[Old Avatar](${oldUser.displayAvatarURL()})` || "No avatar.",
            inline: true,
          },
          {
            name: t("events:member.update.new"),
            value:
              `[New Avatar](${newUser.displayAvatarURL()})` || "No avatar.",
            inline: true,
          },
        ]);

        await logChannel.send({ embeds: [embed] });
      }
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "user update event", err);
  }
};
