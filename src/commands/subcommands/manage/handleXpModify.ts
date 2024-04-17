import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { xpModifyAdd } from "../../../modules/commands/manage/xpModifyAdd";
import { xpModifyRemove } from "../../../modules/commands/manage/xpModifyRemove";
import { xpModifyUpdateRoles } from "../../../modules/commands/manage/xpModifyUpdateRoles";
import { getOptOutRecord } from "../../../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

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

    if (
      !member.permissions.has(PermissionFlagsBits.ManageGuild) &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
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
        content: tFunctionArrayWrapper(t, "responses:noSelfXP"),
      });
      return;
    }

    if (target.bot) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noBotXP"),
      });
      return;
    }

    const optout = await getOptOutRecord(Becca, target.id);

    if (!optout || optout.level) {
      await interaction.editReply({
        content: t("commands:manage.xp.optout"),
      });
      return;
    }

    const user = await Becca.db.newlevels.upsert({
      where: {
        serverID_userID: {
          serverID: guild.id,
          userID: target.id,
        },
      },
      update: {},
      create: {
        serverID: guild.id,
        serverName: guild.name,
        userID: target?.id,
        userTag: target?.tag,
        avatar: target?.displayAvatarURL(),
        points: 0,
        level: 0,
        lastSeen: new Date(Date.now()),
        cooldown: 0,
      },
    });

    const targetMember = await FetchWrapper.member(guild, target.id);

    if (targetMember?.id !== target.id) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:missingMember"),
      });
      return;
    }

    if (action === "add") {
      await xpModifyAdd(Becca, interaction, t, user, amount);
    } else {
      await xpModifyRemove(Becca, interaction, t, user, amount);
    }

    await Becca.db.newlevels.update({
      where: {
        serverID_userID: {
          serverID: guild.id,
          userID: target.id,
        },
      },
      data: {
        points: user.points,
        level: user.level,
        userTag: target.tag,
        avatar: target.displayAvatarURL(),
      },
    });

    if (config.level_roles.length) {
      await xpModifyUpdateRoles(
        Becca,
        interaction,
        t,
        user,
        action,
        config,
        targetMember
      );
    }

    const transVars = {
      mod: `<@!${member.user.id}>`,
      amount,
      target: `<@!${target.id}>`,
    };

    const xpmodifyEmbed = new EmbedBuilder();
    xpmodifyEmbed.setTitle("XP Modified");
    if (action === "add") {
      xpmodifyEmbed.setDescription(t("commands:manage.xp.added", transVars));
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
