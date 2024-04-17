import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { updateHistory } from "../../../modules/commands/moderation/updateHistory";
import { sendLogEmbed } from "../../../modules/guild/sendLogEmbed";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { debugLogger } from "../../../utils/debugLogger";
import { FetchWrapper } from "../../../utils/FetchWrapper";
import { sendModerationDm } from "../../../utils/sendModerationDm";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";

/**
 * Provided the caller has permission, kicks the `target` user from the guild
 * for the given `reason`.
 */
export const handleKick: CommandHandler = async (
  Becca,
  interaction,
  t,
  config
) => {
  try {
    const { guild, member } = interaction;
    const target = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);

    const targetMember = await FetchWrapper.member(guild, target.id);

    if (
      !member.permissions.has(PermissionFlagsBits.KickMembers) ||
      targetMember?.permissions.has(PermissionFlagsBits.KickMembers)
    ) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
      });
      return;
    }

    if (!targetMember) {
      await interaction.editReply({
        content: "That user appears to have left the guild.",
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noModSelf"),
      });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noModBecca"),
      });
      return;
    }

    if (!targetMember.kickable) {
      await interaction.editReply({
        content: t("commands:mod.kick.invalid"),
      });
      return;
    }

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "kick",
      target,
      reason
    );

    const success = await targetMember
      .kick(
        customSubstring(
          `Moderator: ${interaction.user.username}\n\nReason: ${reason}`,
          512
        )
      )
      .catch((err) =>
        debugLogger(
          "kick command",
          err.message,
          `member id ${targetMember.id} in guild id ${guild.id}`
        )
      );

    if (!success) {
      await interaction.editReply({
        content: `Failed to ban ${targetMember.user.username}.`,
      });
      return;
    }

    await updateHistory(Becca, "kick", target.id, guild.id);

    const kickLogEmbed = new EmbedBuilder();
    kickLogEmbed.setColor(Becca.colours.error);
    kickLogEmbed.setTitle(t("commands:mod.kick.title"));
    kickLogEmbed.setDescription(
      t("commands:mod.kick.description", {
        user: member.user.username,
      })
    );
    kickLogEmbed.addFields([
      {
        name: t("commands:mod.kick.reason"),
        value: customSubstring(reason, 1000),
      },
      {
        name: t("commands:mod.kick.notified"),
        value: String(sentNotice),
      },
    ]);
    kickLogEmbed.setTimestamp();
    kickLogEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });
    kickLogEmbed.setFooter({ text: `ID: ${targetMember.id}` });

    await sendLogEmbed(Becca, guild, kickLogEmbed, "moderation_events");
    await interaction.editReply({
      content: t("commands:mod.kick.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "kick command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "kick", errorId, t)],
    });
  }
};
