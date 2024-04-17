import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Adds a new trigger to the server config.
 */
export const handleTriggerAdd: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const trigger = interaction.options.getString("trigger", true);
    const response = interaction.options.getString("response", true);

    const hasTrigger = config.new_triggers.find((el) => el.trigger === trigger);

    if (hasTrigger) {
      await interaction.editReply({
        content: t("commands:triggers.add.duplicate"),
      });
      return;
    }

    if (config.new_triggers.length >= 50) {
      await interaction.editReply({
        content: t("commands:triggers.add.max"),
      });
      return;
    }

    config.new_triggers.push({ trigger, response });

    await Becca.db.servers.update({
      where: {
        serverID: config.serverID,
      },
      data: {
        new_triggers: config.new_triggers,
      },
    });

    const success = new EmbedBuilder();
    success.setTitle(t("commands:triggers.add.title"));
    success.setDescription(t("commands:triggers.add.description", { trigger }));
    success.setColor(Becca.colours.default);
    success.addFields([
      {
        name: t("commands:triggers.add.trigger"),
        value: trigger,
      },
      {
        name: t("commands:triggers.add.response"),
        value: response,
      },
    ]);
    success.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    });
    success.setTimestamp();
    success.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [success] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "trigger add command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "trigger add", errorId, t)],
    });
  }
};
