import { SettingsHandler } from "../../../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { resetSetting } from "../../../modules/settings/resetSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Resets the given `setting` to the default value.
 */
export const handleReset: SettingsHandler = async (
  Becca,
  interaction,
  t,
  config,
  setting
) => {
  try {
    const { guild } = interaction;

    const success = await resetSetting(Becca, guild.id, guild.name, setting);
    await interaction.editReply(
      success
        ? t("commands:config.reset.success", { setting })
        : t("commands:config.reset.failed")
    );
    return;
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reset command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reset", errorId, t)],
    });
  }
};
