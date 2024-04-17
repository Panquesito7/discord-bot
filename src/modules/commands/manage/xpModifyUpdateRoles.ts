import { newlevels, servers } from "@prisma/client";
import { GuildMember } from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { ValidatedChatInputCommandInteraction } from "../../../interfaces/discord/ValidatedChatInputCommandInteraction";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles updating a user's level roles after adding/removing
 * points.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ValidatedChatInputCommandInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 * @param {newlevels} user The user's level record.
 * @param {string} action The action taken.
 * @param {servers} config The server's configuration.
 * @param {GuildMember} targetMember The member to update.
 */
export const xpModifyUpdateRoles = async (
  Becca: BeccaLyria,
  interaction: ValidatedChatInputCommandInteraction,
  t: TFunction,
  user: newlevels,
  action: string,
  config: servers,
  targetMember: GuildMember
) => {
  try {
    for (const setting of config.level_roles) {
      if (action === "add" && user.level >= setting.level) {
        const role = interaction.guild.roles.cache.find(
          (r) => r.id === setting.role
        );
        if (role && !targetMember.roles.cache.find((r) => r.id === role.id)) {
          await targetMember.roles.add(role);
        }
      }
      if (action === "remove" && user.level <= setting.level) {
        const role = interaction.guild.roles.cache.find(
          (r) => r.id === setting.role
        );
        if (role && targetMember.roles.cache.find((r) => r.id === role.id)) {
          await targetMember.roles.remove(role);
        }
      }
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "xp modify add command",
      err,
      interaction.guild.name
    );
  }
};
