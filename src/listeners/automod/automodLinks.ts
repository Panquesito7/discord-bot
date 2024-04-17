import { EmbedBuilder } from "discord.js";

import { defaultServer } from "../../config/database/defaultServer";
import { ListenerHandler } from "../../interfaces/listeners/ListenerHandler";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { customSubstring } from "../../utils/customSubstring";

/**
 * Detects links in a message and responds accordingly.
 */
export const automodLinks: ListenerHandler = async (
  Becca,
  message,
  t,
  config
) => {
  try {
    const contentWithoutCode = message.content.replace(
      /`{3}(\S+)?\n((?!`{3})((?!```)[\s\S])+)\n`{3}/gi,
      ""
    );

    const allowedLinkList: string[] = [];
    const blockedLinkList: string[] = [];

    if (config.allowed_links.length) {
      for (const str of config.allowed_links) {
        const regex = new RegExp(str, "ig");
        const matches = contentWithoutCode.match(regex);
        if (matches) {
          allowedLinkList.push(...matches);
        }
      }
    }

    if (config.automod_roles.length) {
      for (const role of config.automod_roles) {
        if (message.member?.roles.cache.find((r) => r.id === role)) {
          return;
        }
      }
    }

    const linkRegex =
      /(https?:\/\/(([a-z0-9-]+\.)+([a-z]{2,})))(:\d{1,5})?[^\s]*/gi;

    const blockedMatches = contentWithoutCode.match(linkRegex);
    if (blockedMatches) {
      blockedLinkList.push(...blockedMatches);
    }

    const blockedLinks = blockedLinkList.length;
    const allowedLinks = allowedLinkList.length;

    if (blockedLinks > 0 && blockedLinks > allowedLinks) {
      if (message.deletable) {
        await message.delete();
      }
      const linkEmbed = new EmbedBuilder();
      linkEmbed.setTitle(t("listeners:automod.links.title"));
      linkEmbed.setDescription(
        (config.link_message || defaultServer.link_message).replace(
          /\{@username\}/g,
          `<@!${message.author.id}>`
        )
      );
      linkEmbed.setColor(Becca.colours.error);
      linkEmbed.setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL(),
      });
      linkEmbed.setFooter({
        text: t("defaults:footer"),
        iconURL: "https://cdn.nhcarrigan.com/profile.png",
      });
      const warning = await message.channel.send({ embeds: [linkEmbed] });

      setTimeout(async () => {
        await warning.delete();
      }, 300000);

      const dmEmbed = new EmbedBuilder();
      dmEmbed.setTitle("Your message has been deleted...");
      dmEmbed.setDescription(
        `${t("listeners:automod.links.dmTitle")}\n\`\`\`\n${customSubstring(
          message.content,
          2000
        )}\n\`\`\``
      );
      dmEmbed.setColor(Becca.colours.error);
      dmEmbed.addFields([
        {
          name: t("listeners:automod.links.server"),
          value: message.guild?.name || "unknown",
        },
        {
          name: t("listeners:automod.links.channel"),
          value: message.channel.toString(),
        },
        {
          name: t("listeners:automod.links.reason"),
          value: t("listeners:automod.links.blocked"),
        },
        {
          name: t("listeners:automod.links.links"),
          value:
            blockedLinkList.join(" ") || t("listeners:automod.links.noBlocked"),
        },
        {
          name: t("listeners:automod.links.allowed"),
          value:
            allowedLinkList.join(" ") || t("listeners:automod.links.noAllowed"),
        },
      ]);

      await message.author.send({ embeds: [dmEmbed] }).catch(() => null);
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "links automodder",
      err,
      message.guild?.name,
      message
    );
  }
};
