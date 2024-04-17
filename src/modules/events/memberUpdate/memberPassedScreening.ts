import { servers } from "@prisma/client";
import { EmbedBuilder, GuildMember } from "discord.js";
import { TFunction } from "i18next";

import { defaultServer } from "../../../config/database/defaultServer";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { sendWelcomeEmbed } from "../../guild/sendWelcomeEmbed";

/**
 * Processes the logic when a member passes Discord screening.
 * Sends the welcome embed and adds the join role.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {GuildMember} member The member payload from Discord.
 * @param {servers} settings The server's settings.
 * @param {TFunction} t Translation function.
 */
export const memberPassedScreening = async (
  Becca: BeccaLyria,
  member: GuildMember,
  settings: servers,
  t: TFunction
) => {
  try {
    const { guild, user } = member;
    const welcomeText = (
      settings.custom_welcome || defaultServer.custom_welcome
    )
      .replace(/{@username}/gi, user.username)
      .replace(/{@servername}/gi, guild.name);

    if (settings.welcome_style === "embed") {
      const welcomeEmbed = new EmbedBuilder();
      welcomeEmbed.setColor(Becca.colours.default);
      welcomeEmbed.setTitle(t("events:member.join.title"));
      welcomeEmbed.setDescription(welcomeText);
      welcomeEmbed.setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      });
      welcomeEmbed.setFooter({ text: `ID: ${user.id}` });
      welcomeEmbed.setTimestamp();

      await sendWelcomeEmbed(Becca, guild, "join", welcomeEmbed);
    } else if (settings.welcome_style === "text") {
      const channel = await FetchWrapper.channel(
        guild,
        settings.welcome_channel
      );
      if (channel?.isTextBased()) {
        await channel.send({
          content: welcomeText,
          allowedMentions: {},
        });
      }
    }

    if (settings?.join_role) {
      const joinRole = await FetchWrapper.role(guild, settings.join_role);
      if (joinRole) {
        await member.roles.add(joinRole);
      }
    }
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "member passed screening module",
      err,
      member.guild.name
    );
  }
};
