import {
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  TextBasedChannel,
} from "discord.js";
import { TFunction } from "i18next";

import { BeccaLyria } from "../../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Validates that Becca has the expected channel-level permissions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to check permissions on.
 * @returns {boolean} True if Becca has ALL required permissions, false otherwise.
 */
export const validateChannelPerms = async (
  Becca: BeccaLyria,
  t: TFunction,
  BeccaMember: GuildMember,
  channel: TextBasedChannel
): Promise<boolean> => {
  try {
    const manageServer = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ManageGuild
    );
    const manageRoles = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ManageRoles
    );
    const manageChannels = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ManageChannels
    );
    const kickMembers = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.KickMembers
    );
    const banMembers = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.BanMembers
    );
    const sendMessages = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.SendMessages
    );
    const manageMessages = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ManageMessages
    );
    const embedLinks = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.EmbedLinks
    );
    const attachFiles = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.AttachFiles
    );
    const readMessageHistory = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ReadMessageHistory
    );
    const addReactions = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.AddReactions
    );
    const useEmotes = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.UseExternalEmojis
    );
    const manageNicknames = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ManageNicknames
    );
    const moderateMembers = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ModerateMembers
    );
    const viewChannel = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ViewChannel
    );
    const readMessages = BeccaMember.permissionsIn(channel.id).has(
      PermissionFlagsBits.ReadMessageHistory
    );

    const permissionEmbed = new EmbedBuilder();
    permissionEmbed.setTitle(t("commands:misc.permissions.channel.title"));
    permissionEmbed.setDescription(
      t("commands:misc.permissions.channel.description")
    );
    permissionEmbed.addFields([
      {
        name: t("commands:misc.permissions.names.server"),
        value: `${manageServer}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.roles"),
        value: `${manageRoles}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.channels"),
        value: `${manageChannels}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.kick"),
        value: `${kickMembers}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.ban"),
        value: `${banMembers}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.send"),
        value: `${sendMessages}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.message"),
        value: `${manageMessages}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.embed"),
        value: `${embedLinks}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.attach"),
        value: `${attachFiles}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.history"),
        value: `${readMessageHistory}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.react"),
        value: `${addReactions}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.emote"),
        value: `${useEmotes}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.nick"),
        value: `${manageNicknames}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.mod"),
        value: `${moderateMembers}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.view"),
        value: `${viewChannel}`,
        inline: true,
      },
      {
        name: t("commands:misc.permissions.names.read"),
        value: `${readMessages}`,
        inline: true,
      },
    ]);
    permissionEmbed.setColor(Becca.colours.default);
    permissionEmbed.setTimestamp();
    permissionEmbed.setFooter({ text: `ID: ${channel.id}` });

    await channel.send({ embeds: [permissionEmbed] });

    return (
      manageServer &&
      manageRoles &&
      manageChannels &&
      kickMembers &&
      banMembers &&
      sendMessages &&
      manageMessages &&
      embedLinks &&
      attachFiles &&
      readMessageHistory &&
      addReactions &&
      useEmotes &&
      manageNicknames &&
      moderateMembers &&
      viewChannel &&
      readMessages
    );
  } catch (err) {
    await beccaErrorHandler(Becca, "validate channel perms module", err);
    return false;
  }
};
