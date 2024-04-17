import { PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Allows members to send messages from Becca's account.
 */
export const handleEcho: CommandHandler = async (Becca, interaction, t) => {
  try {
    const input = interaction.options.getString("message", true);
    if (
      !interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)
    ) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }
    interaction.channel.send(input);
    await interaction.editReply({
      content: "Your message has been posted.",
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "echo command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "echo", errorId, t)],
    });
  }
};
