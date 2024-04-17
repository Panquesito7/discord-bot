import { EmbedBuilder } from "discord.js";

import { httpStatus } from "../../../config/commands/httpStatus";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Returns a cat photo depicting the given HTTP `status`.
 */
export const handleHttp: CommandHandler = async (Becca, interaction, t) => {
  try {
    const status = interaction.options.getInteger("status", true);

    if (!httpStatus.includes(status)) {
      await interaction.editReply({
        content: t("commands:code.http.invalid"),
      });
      return;
    }
    const httpEmbed = new EmbedBuilder();
    httpEmbed.setTitle(t("commands:code.http.title", { status }));
    httpEmbed.setImage(`https://http.cat/${status}.jpg`);
    httpEmbed.setColor(Becca.colours.default);
    httpEmbed.setTimestamp();
    httpEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [httpEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "http command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "http", errorId, t)],
    });
  }
};
