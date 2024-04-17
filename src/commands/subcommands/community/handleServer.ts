import { ChannelType, EmbedBuilder } from "discord.js";

import {
  accountVerificationMap,
  contentFilterMap,
} from "../../../config/commands/serverInfo";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";

/**
 * Generates an embed listing the various Discord settings for the specific server.
 */
export const handleServer: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { guild } = interaction;

    const guildOwner = await FetchWrapper.member(guild, guild.ownerId);
    const guildMembers = (await guild.members.fetch()).map((u) => u);
    const guildBans = await guild.bans.fetch();
    const guildChannels = guild.channels.cache;
    const guildEmojis = guild.emojis.cache;
    const guildMfa = guild.mfaLevel
      ? t("commands:community.server.mfa")
      : t("commands:community.server.nomfa");

    const serverEmbed = new EmbedBuilder();
    serverEmbed.setColor(Becca.colours.default);
    serverEmbed.setTitle(guild.name);
    serverEmbed.setDescription(
      guild.description || t("commands:community.server.description")
    );
    serverEmbed.setThumbnail(guild.iconURL() || "");
    serverEmbed.addFields([
      {
        name: t("commands:community.server.creation"),
        value: new Date(guild.createdTimestamp).toLocaleDateString(),
        inline: true,
      },
      {
        name: t("commands:community.server.owner"),
        value: guildOwner?.toString() || "unknown",
        inline: true,
      },
      {
        name: t("commands:community.server.members"),
        value: guild.memberCount.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.living"),
        value: guildMembers
          .filter((member) => !member.user.bot)
          .length.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.bot"),
        value: guildMembers
          .filter((member) => member.user.bot)
          .length.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.ban"),
        value: guildBans.size.toString(),
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: true,
      },
      {
        name: t("commands:community.server.titles"),
        value: guild.roles.cache.size.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.channels"),
        value: guildChannels.size.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.text"),
        value: guildChannels
          .filter((chan) => chan.type === ChannelType.GuildText)
          .size.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.voice"),
        value: guildChannels
          .filter((chan) => chan.type === ChannelType.GuildVoice)
          .size.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.boost"),
        value: `Level ${guild.premiumTier} with ${guild.premiumSubscriptionCount} boosts.`,
        inline: true,
      },
      {
        name: t("commands:community.server.semote"),
        value: guildEmojis.filter((emote) => !emote.animated).size.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.aemote"),
        value: guildEmojis
          .filter((emote) => Boolean(emote.animated))
          .size.toString(),
        inline: true,
      },
      {
        name: t("commands:community.server.content"),
        value: contentFilterMap[guild.explicitContentFilter],
        inline: true,
      },
      {
        name: t("commands:community.server.auth"),
        value: guildMfa,
        inline: true,
      },
      {
        name: t("commands:community.server.account"),
        value: accountVerificationMap[guild.verificationLevel],
        inline: true,
      },
      {
        name: t("commands:community.server.status"),
        value: t("commands:community.server.statuses", {
          partnered: guild.partnered,
          verified: guild.verified,
        }),
        inline: true,
      },
      {
        name: t("commands:community.server.special"),
        value: t("commands:community.server.schannels", {
          system: guild.systemChannel?.name || "null",
          rules: guild.rulesChannel?.name || "null",
          public: guild.publicUpdatesChannel?.name || "null",
        }),
        inline: true,
      },
    ]);
    serverEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    await interaction.editReply({ embeds: [serverEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "server command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "server", errorId, t)],
    });
  }
};
