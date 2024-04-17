import { exec } from "child_process";
import { promisify } from "util";

import { AttachmentBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { isSupportStaff } from "../../../modules/commands/support/isSupportStaff";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";

const asyncExec = promisify(exec);

/**
 * Handles parsing logs for lines related to a specific guild.
 */
export const handleLogs: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user } = interaction;
    const guildId = interaction.options.getString("id", true);

    const isStaff = await isSupportStaff(Becca, user.id);

    if (!isStaff) {
      await interaction.editReply({
        content: t("commands:support.logs.notStaff"),
      });
      return;
    }

    if (!/^\d{16,19}$/.test(guildId)) {
      await interaction.editReply({
        content: t("commands:support.logs.invalidId", {
          id: guildId,
        }),
      });
      return;
    }

    const guild = await FetchWrapper.guild(Becca, guildId);

    const command = guild
      ? `grep -e "${guildId}" -e "${guild.name}" ~/.pm2/logs/Becca-out.log`
      : `grep -r "${guildId}" ~/.pm2/logs/Becca-out.log`;

    const { stdout: logs } = await asyncExec(command);

    const attachment = new AttachmentBuilder(
      // PM2 appends control characters to the logs, we remove them for readability.
      // skipcq: JS-W1035
      Buffer.from(logs.replace(/\x1b\[2K\x1b\[1A\x1b\[2K\x1b\[G/gu, "")),
      {
        name: `${guildId}.log`,
      }
    );

    await interaction.editReply({
      content: t("commands:support.logs.logs"),
      files: [attachment],
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "handle logs",
      err,
      interaction.guild?.id,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "logs", errorId, t)],
    });
  }
};
