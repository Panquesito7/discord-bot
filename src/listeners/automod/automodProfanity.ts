import Filter from "bad-words";
import { EmbedBuilder } from "discord.js";

import { defaultServer } from "../../config/database/defaultServer";
import { ListenerHandler } from "../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

/**
 * Description coming soon.
 */
export const automodProfanity: ListenerHandler = async (
  Becca,
  message,
  t,
  config
) => {
  try {
    const filter = new Filter();
    if (!filter.isProfane(message.content)) {
      return;
    }

    const string = customSubstring(
      config.profanity_message || defaultServer.profanity_message,
      2000
    ).replace(/\{@username\}/g, `<@!${message.author.id}>`);

    const embed = new EmbedBuilder();
    embed.setTitle(t("listeners:automod.profanity.title"));
    embed.setDescription(string);
    embed.setColor(Becca.colours.error);
    embed.setAuthor({
      name: message.author.tag,
      iconURL: message.author.displayAvatarURL(),
    });
    embed.setTimestamp();
    embed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await message.delete();
    const warning = await message.channel.send({ embeds: [embed] });

    const dmEmbed = new EmbedBuilder();
    dmEmbed.setTitle(t("listeners:automod.profanity.dmTitle"));
    dmEmbed.setURL(warning.url);
    dmEmbed.setDescription(
      `${t("listeners:automod.profanity.dmDesc")}\n\`\`\`\n${filter.clean(
        message.content
      )}\n\`\`\``
    );
    dmEmbed.setColor(Becca.colours.error);
    dmEmbed.addFields([
      {
        name: t("listeners:automod.profanity.reason"),
        value: message.guild?.name || "unknown",
      },
      {
        name: t("listeners:automod.profanity.channel"),
        value: message.channel.toString(),
      },
      {
        name: t("listeners:automod.profanity.reason"),
        value: t("listeners:automod.profanity.profane"),
      },
    ]);

    await message.author.send({ embeds: [dmEmbed] }).catch(() => null);
  } catch (error) {
    await beccaErrorHandler(
      Becca,
      "profanity automod",
      error,
      message.guild?.name,
      message
    );
  }
};
