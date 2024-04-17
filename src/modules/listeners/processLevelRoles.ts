import { newlevels, servers } from "@prisma/client";
import { EmbedBuilder, GuildTextBasedChannel } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { ValidatedMessage } from "../../interfaces/discord/ValidatedMessage";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { debugLogger } from "../../utils/debugLogger";

import { generateRoleText } from "./generateRoleText";

/**
 * Processes level roles for the level listener.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {newlevels} user The user's level record.
 * @param {servers} settings The guild's setting record.
 * @param {ValidatedMessage} message The message payload from Discord.
 * @param {GuildTextBasedChannel } targetChannel The channel to send role messages to.
 * @param {TFunction} t Translation function.
 */
export const processLevelRoles = async (
  Becca: BeccaLyria,
  user: newlevels,
  settings: servers,
  message: ValidatedMessage,
  targetChannel: GuildTextBasedChannel,
  t: TFunction
) => {
  try {
    const { guild, member, author } = message;
    for (const setting of settings.level_roles) {
      if (user.level < setting.level) {
        const role = guild.roles.cache.find((r) => r.id === setting.role);
        if (role && !member?.roles.cache.find((r) => r.id === role.id)) {
          await member?.roles.remove(role);
        }
      }
      if (user.level >= setting.level) {
        const role = guild.roles.cache.find((r) => r.id === setting.role);
        if (role && !member?.roles.cache.find((r) => r.id === role.id)) {
          await member?.roles.add(role).catch(async () => {
            await targetChannel
              .send({
                content: `I should have given you the ${role.name} role, but I don't have permission to do so. Please ask a server admin to give you the role.`,
              })
              .catch((err) =>
                debugLogger(
                  "level listener",
                  err.message,
                  `channel id ${targetChannel.id} in guild id ${guild.id}`
                )
              );
          });
          const content = settings.role_message
            ? generateRoleText(settings.role_message, author, role)
            : t("listeners:level.roleDesc", {
                user: `<@!${author.id}>`,
                role: `<@&${role.id}>`,
              });
          if (settings.level_style === "embed") {
            const roleEmbed = new EmbedBuilder();
            roleEmbed.setTitle(t("listeners:level.roleTitle"));
            roleEmbed.setDescription(content);
            roleEmbed.setColor(Becca.colours.default);
            roleEmbed.setAuthor({
              name: author.tag,
              iconURL: author.displayAvatarURL(),
            });
            roleEmbed.setFooter({
              text: t("defaults:footer"),
              iconURL: "https://cdn.nhcarrigan.com/profile.png",
            });
            await targetChannel
              .send({ embeds: [roleEmbed] })
              .catch((err) =>
                debugLogger(
                  "level listener",
                  err.message,
                  `channel id ${targetChannel.id} in guild id ${guild.id}`
                )
              );
          } else {
            await targetChannel
              .send({ content, allowedMentions: {} })
              .catch((err) =>
                debugLogger(
                  "level listener",
                  err.message,
                  `channel id ${targetChannel.id} in guild id ${guild.id}`
                )
              );
          }
        }
      }
    }
  } catch (err) {
    await beccaErrorHandler(Becca, "process level roles", err);
  }
};
