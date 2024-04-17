import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { generateUsername } from "../../../modules/commands/general/generateUsername";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates a random DigitalOcean themed username and sends it in an embed.
 * Limits the length of the username to `length`, or 30.
 */
export const handleUsername: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { user } = interaction;
    const length = interaction.options.getInteger("length") || 30;

    const username = generateUsername(length);

    const usernameEmbed = new EmbedBuilder();
    usernameEmbed.setColor(Becca.colours.default);
    usernameEmbed.setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL(),
    });
    usernameEmbed.setDescription(t("commands:misc.username.description"));
    usernameEmbed.addFields([
      {
        name: t("commands:misc.username.user"),
        value: username,
      },
      {
        name: t("commands:misc.username.gen"),
        value: username.length.toString(),
        inline: true,
      },
      {
        name: t("commands:misc.username.max"),
        value: length.toString(),
        inline: true,
      },
    ]);
    usernameEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [usernameEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "username command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "username", errorId, t)],
    });
  }
};
