/* eslint-disable jsdoc/require-param */
import { GuildMember, MessageEmbed } from "discord.js";

import levelScale from "../../../../config/listeners/levelScale";
import { LevelOptOut } from "../../../../config/optout/LevelOptOut";
import LevelModel from "../../../../database/models/LevelModel";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

/**
 * Modifies the xp of a `user` depending on the `action` taken
 * and the `amount` specified.
 */
export const handleXpModify: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, member } = interaction;

    const action = interaction.options.getString("action", true);
    const target = interaction.options.getUser("user", true);
    const amount = interaction.options.getNumber("adjustment", true);

    if (!guild || !member) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (
      !(member as GuildMember).permissions.has("MANAGE_GUILD") &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    if (config.levels !== "on") {
      await interaction.editReply({
        content: t("commands:manage.xp.disabled"),
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noSelfXP")),
      });
      return;
    }

    if (target.bot) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noBotXP")),
      });
      return;
    }

    if (LevelOptOut.includes(target?.id)) {
      await interaction.editReply({
        content: t("commands:manage.xp.optout"),
      });
      return;
    }

    const user =
      (await LevelModel.findOne({ serverID: guild.id, userID: target.id })) ||
      (await LevelModel.create({
        serverID: guild.id,
        serverName: guild.name,
        userID: target?.id,
        userTaf: target?.tag,
        avatar: target?.displayAvatarURL(),
        points: 0,
        level: 0,
        lastSeen: new Date(Date.now()),
        cooldown: 0,
      }));

    const targetMember = await guild.members.fetch(target.id);

    if (!targetMember || targetMember.id !== target.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (action === "add") {
      if (user.level >= 100) {
        await interaction.editReply({
          content: t("commands:manage.xp.max"),
        });
        return;
      }
      user.points += amount;
      while (user.points > levelScale[user.level + 1]) {
        user.level++;
      }
    } else {
      if (user.points - amount <= 0) {
        await interaction.editReply({
          content: t("commands:manage.xp.min"),
        });
        return;
      }
      user.points -= amount;
      while (user.points <= levelScale[user.level]) {
        user.level--;
      }
    }

    user.userTag = target.tag;
    user.avatar = target.displayAvatarURL();

    await user.save();

    if (config.level_roles.length) {
      for (const setting of config.level_roles) {
        if (action === "add" && user.level >= setting.level) {
          const role = guild.roles.cache.find((r) => r.id === setting.role);
          if (role && !targetMember.roles.cache.find((r) => r.id === role.id)) {
            await targetMember.roles.add(role);
          }
        }
        if (action === "remove" && user.level <= setting.level) {
          const role = guild.roles.cache.find((r) => r.id === setting.role);
          if (role && targetMember.roles.cache.find((r) => r.id === role.id)) {
            await targetMember.roles.remove(role);
          }
        }
      }
    }

    const transVars = {
      mod: `<@!${member.user.id}>`,
      amount,
      target: `<@!${target.id}>`,
    };

    const xpmodifyEmbed = new MessageEmbed();
    xpmodifyEmbed.setTitle("XP Modified");
    if (action === "add") {
      xpmodifyEmbed.setDescription(t("commands:manage.ex.added", transVars));
    } else {
      xpmodifyEmbed.setDescription(t("commands:manage.xp.removed", transVars));
    }
    xpmodifyEmbed.setColor(Becca.colours.default);
    await interaction.editReply({
      embeds: [xpmodifyEmbed],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "xpmodify command",
      err,
      interaction.guild?.name
    );
    await interaction
      .reply({
        embeds: [errorEmbedGenerator(Becca, "xpmodify", errorId, t)],
        ephemeral: true,
      })
      .catch(async () => {
        await interaction.editReply({
          embeds: [errorEmbedGenerator(Becca, "xpmodify", errorId, t)],
        });
      });
  }
};
