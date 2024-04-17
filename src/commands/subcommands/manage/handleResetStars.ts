import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Deletes the server's star counts, resetting everyone's progress.
 */
export const handleResetStars: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { member, guild } = interaction;

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    const starData = await Becca.db.starcounts.findUnique({
      where: {
        serverID: guild.id,
      },
    });

    if (!starData) {
      await interaction.editReply({
        content: t("commands:manage.stars.none"),
      });
      return;
    }

    await Becca.db.starcounts.update({
      where: {
        serverID: guild.id,
      },
      data: {
        users: [],
      },
    });
    await interaction.editReply({
      content: t("commands:manage.stars.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset stars command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset stars", errorId, t)],
    });
  }
};
