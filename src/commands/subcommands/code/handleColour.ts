import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Constructs an embed with a visual representation of the colour passed to
 * the `hex` argument.
 */
export const handleColour: CommandHandler = async (Becca, interaction, t) => {
  try {
    const targetColour = interaction.options.getString("hex", true);

    const parsedColour = targetColour.startsWith("#")
      ? targetColour.slice(1)
      : targetColour;

    if (!/^[0-9a-fA-F]{6}$/.test(parsedColour)) {
      await interaction.editReply({
        content: t("commands:code.colour.invalid"),
      });
      return;
    }

    const colourEmbed = new EmbedBuilder();
    colourEmbed.setTitle(
      t("commands:code.colour.title", { hex: parsedColour })
    );
    colourEmbed.setColor(parseInt(parsedColour, 16));
    colourEmbed.setImage(`https://www.colorhexa.com/${parsedColour}.png`);
    colourEmbed.setTimestamp();
    colourEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [colourEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "colour command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "colour", errorId, t)],
    });
  }
};
