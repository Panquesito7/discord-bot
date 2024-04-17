import {
  ChannelType,
  EmbedBuilder,
  GuildBasedChannel,
  PermissionFlagsBits,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { createEvent } from "../../../modules/events/scheduledEvent";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getInteractionLanguage } from "../../../utils/getLangCode";

/**
 * Allows a user to schedule a post to be sent to a specific channel, up to
 * 24 hours in advance. Does not allow for a post to be sent to a channel
 * where the user does not have permission to send messages themselves.
 * Scheduled posts are stored in memory, so are lost in a reboot.
 */
export const handleSchedule: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { member } = interaction;
    const time = interaction.options.getInteger("time", true);
    const targetChannel = interaction.options.getChannel("channel", true);
    const message = interaction.options.getString("message", true);

    if (
      !member
        .permissionsIn(targetChannel as GuildBasedChannel)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      await interaction.editReply({
        content: t("commands:community.schedule.permission"),
      });
      return;
    }

    if (
      targetChannel.type !== ChannelType.GuildText &&
      targetChannel.type !== ChannelType.GuildAnnouncement
    ) {
      await interaction.editReply({
        content: t("commands:community.schedule.notext"),
      });
      return;
    }

    if (time < 1 || time > 1440) {
      await interaction.editReply({
        content: t("commands:community.schedule.badtime"),
      });
      return;
    }

    await createEvent(Becca, {
      member: member.user.id,
      time: Date.now() + time * 60000,
      targetChannel: targetChannel.id,
      lang: getInteractionLanguage(interaction),
      message,
    });

    const successEmbed = new EmbedBuilder();
    successEmbed.setTitle(t("commands:community.schedule.embed.title"));
    successEmbed.setDescription(
      t("commands:community.schedule.embed.description")
    );
    successEmbed.setColor(Becca.colours.default);
    successEmbed.addFields([
      {
        name: t("commands:community.schedule.embed.time"),
        value: t("commands:community.schedule.embed.minutes", {
          time,
        }),
        inline: true,
      },
      {
        name: t("commands:community.schedule.embed.channel"),
        value: `<#${targetChannel.id}>`,
        inline: true,
      },
      {
        name: t("commands:community.schedule.embed.message"),
        value: message,
      },
    ]);
    successEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile-transparent",
    });
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "schedule command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "schedule", errorId, t)],
    });
  }
};
