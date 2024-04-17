import { EmbedBuilder } from "discord.js";

import { Context } from "../interfaces/contexts/Context";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const activity: Context = {
  data: {
    name: "activity",
    type: 2,
  },
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply({ ephemeral: true });
      const target = interaction.options.getUser("user", true);

      const data = await Becca.db.activities.findUnique({
        where: {
          userId: target.id,
        },
      });
      if (!data) {
        await interaction.editReply(
          "That user has not interacted with me yet..."
        );
        return;
      }

      const activityEmbed = new EmbedBuilder();
      activityEmbed.setTitle(t("contexts:activity.title"));
      activityEmbed.addFields([
        {
          name: t("contexts:activity.buttons"),
          value: data.buttons.toString(),
          inline: true,
        },
        {
          name: t("contexts:activity.commands"),
          value: data.commands.toString(),
          inline: true,
        },
        {
          name: t("contexts:activity.selects"),
          value: data.selects.toString(),
          inline: true,
        },
        {
          name: t("contexts:activity.contexts"),
          value: data.contexts.toString(),
          inline: true,
        },
      ]);
      activityEmbed.setColor(Becca.colours.default);
      activityEmbed.setAuthor({
        name: target.tag,
        iconURL: target.displayAvatarURL(),
      });
      activityEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });

      await interaction.editReply({ embeds: [activityEmbed] });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "activity context command",
        err,
        interaction.guild?.name
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "activity context", errorId, t)],
      });
    }
  },
};
