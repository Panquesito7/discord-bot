import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Deletes the server's level data, resetting everyone's progress.
 */
export const handleResetLevels: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guild, member } = interaction;

    if (
      !member.permissions.has(PermissionFlagsBits.ManageGuild) &&
      member.user.id !== Becca.configs.ownerId
    ) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    const currentLevels = await Becca.db.newlevels.findMany({
      where: {
        serverID: guild.id,
      },
    });

    if (!currentLevels?.length) {
      await interaction.editReply({
        content: t("commands:manage.levels.none"),
      });
      return;
    }
    for (const level of currentLevels) {
      await Becca.db.newlevels.delete({
        where: {
          serverID_userID: {
            serverID: level.serverID,
            userID: level.userID,
          },
        },
      });
    }
    await interaction.editReply({
      content: t("commands:manage.levels.success"),
    });
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset level command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset level", errorId, t)],
    });
  }
};
