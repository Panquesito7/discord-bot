import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { validateChannelPerms } from "../../../modules/commands/server/validateChannelPerms";
import { validateServerPerms } from "../../../modules/commands/server/validateServerPerms";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Validates that Becca has the correct permissions in the server and the
 * specific channel.
 */
export const handlePermissions: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { channel, guild, member } = interaction;

    if (
      !member.permissions.has(PermissionFlagsBits.ManageGuild) &&
      member.id !== Becca.configs.ownerId
    ) {
      await interaction.reply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    const BeccaMember = await FetchWrapper.becca(Becca, guild);

    if (!BeccaMember) {
      await interaction.editReply({
        content: t("commands:misc.permissions.missing"),
      });
      return;
    }

    const hasChannelPerms = await validateChannelPerms(
      Becca,
      t,
      BeccaMember,
      channel
    );
    const hasGuildPerms = await validateServerPerms(
      Becca,
      t,
      BeccaMember,
      channel
    );

    const areValid = hasChannelPerms && hasGuildPerms;

    const descriptionString = areValid
      ? t("commands:misc.permissions.valid")
      : t("commands:misc.permissions.invalid");

    const validEmbed = new EmbedBuilder();
    validEmbed.setTitle(
      areValid
        ? t("commands:misc.permissions.yes")
        : t("commands:misc.permissions.no")
    );
    validEmbed.setDescription(descriptionString);
    validEmbed.setColor(areValid ? Becca.colours.success : Becca.colours.error);
    validEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [validEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "permissions command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "permissions", errorId, t)],
    });
  }
};
