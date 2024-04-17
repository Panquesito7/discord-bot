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
 * Validates that Becca has the expected guild-level permissions.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {TFunction} t The i18n function.
 * @param {GuildMember} BeccaMember Becca's guild member object for that server.
 * @param {TextBasedChannel} channel The channel to send the result to.
 * @returns {boolean} True if Becca has ALL required permissions, false otherwise.
 */
export const validateServerPerms = async (
  Becca: BeccaLyria,
  t: TFunction,
  BeccaMember: GuildMember,
  channel: TextBasedChannel
): Promise<boolean> => {
  try {
    const manageServer = BeccaMember.permissions.has(
      PermissionFlagsBits.ManageGuild
    );
    const manageRoles = BeccaMember.permissions.has(
      PermissionFlagsBits.ManageRoles
    );
    const manageChannels = BeccaMember.permissions.has(
      PermissionFlagsBits.ManageChannels
    );
    const kickMembers = BeccaMember.permissions.has(
      PermissionFlagsBits.KickMembers
    );
    const banMembers = BeccaMember.permissions.has(
      PermissionFlagsBits.BanMembers
    );
    const sendMessages = BeccaMember.permissions.has(
      PermissionFlagsBits.SendMessages
    );
    const manageMessages = BeccaMember.permissions.has(
      PermissionFlagsBits.ManageMessages
    );
    const embedLinks = BeccaMember.permissions.has(
      PermissionFlagsBits.EmbedLinks
    );
    const attachFiles = BeccaMember.permissions.has(
      PermissionFlagsBits.AttachFiles
    );
    const readMessageHistory = BeccaMember.permissions.has(
      PermissionFlagsBits.ReadMessageHistory
    );
    const addReactions = BeccaMember.permissions.has(
      PermissionFlagsBits.AddReactions
    );
    const useEmotes = BeccaMember.permissions.has(
      PermissionFlagsBits.UseExternalEmojis
    );
    const manageNicknames = BeccaMember.permissions.has(
      PermissionFlagsBits.ManageNicknames
    );
    const moderateMembers = BeccaMember.permissions.has(
      PermissionFlagsBits.ModerateMembers
    );
    const viewChannel = BeccaMember.permissions.has(
      PermissionFlagsBits.ViewChannel
    );
    const readMessages = BeccaMember.permissions.has(
      PermissionFlagsBits.ReadMessageHistory
    );

    const permissionEmbed = new EmbedBuilder();
    permissionEmbed.setTitle(t("commands:misc.permissions.guild.title"));
    permissionEmbed.setDescription(
      t("commands:misc.permissions.guild.description")
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
    permissionEmbed.setFooter({ text: `ID: ${BeccaMember.guild.id}` });

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
    await beccaErrorHandler(Becca, "validate server perms module", err);
    return false;
  }
};
