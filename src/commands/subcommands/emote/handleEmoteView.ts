import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Renders a user's emote data into an embed.
 */
export const handleEmoteView: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const data = await Becca.db.emotecounts.findUnique({
      where: {
        userId: interaction.user.id,
      },
    });

    if (!data) {
      await interaction.editReply({
        content: t("commands:emote.view.none"),
      });
      return;
    }

    const total =
      data.hug +
      data.kiss +
      data.pat +
      data.boop +
      data.throw +
      data.smack +
      data.uwu;

    const emoteEmbed = new EmbedBuilder();
    emoteEmbed.setTitle(t("commands:emote.view.title"));
    emoteEmbed.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.displayAvatarURL(),
    });
    emoteEmbed.setColor(Becca.colours.default);
    emoteEmbed.setDescription(t("commands:emote.view.description", { total }));
    emoteEmbed.addFields([
      {
        name: t("commands:emote.view.hugs"),
        value: data.hug.toString(),
        inline: true,
      },
      {
        name: t("commands:emote.view.kisses"),
        value: data.kiss.toString(),
        inline: true,
      },
      {
        name: t("commands:emote.view.pats"),
        value: data.pat.toString(),
        inline: true,
      },
      {
        name: t("commands:emote.view.boops"),
        value: data.boop.toString(),
        inline: true,
      },
      {
        name: t("commands:emote.view.throws"),
        value: data.throw.toString(),
        inline: true,
      },
      {
        name: t("commands:emote.view.smacks"),
        value: data.smack.toString(),
        inline: true,
      },
      {
        name: t("commands:emote.view.uwus"),
        value: data.uwu.toString(),
        inline: true,
      },
    ]);
    emoteEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent",
    });

    await interaction.editReply({ embeds: [emoteEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote view command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote view", errorId, t)],
    });
  }
};
