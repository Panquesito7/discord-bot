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
 * If the server has configured a muted role, removes it from the `target` for the
 * given `reason`.
 */
export const handleUnmute: CommandHandler = async (
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

    if (!targetMember) {
      await interaction.editReply({
        content: t("commands:mod.mute.left"),
      });
      return;
    }

    if (
      !member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      targetMember?.permissions.has(PermissionFlagsBits.ModerateMembers)
    ) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noPermission"),
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

    const success = await targetMember
      .timeout(
        null,
        customSubstring(
          `Moderator: ${interaction.user.username}\n\nReason: ${reason}`,
          512
        )
      )
      .catch((err) =>
        debugLogger(
          "unmute command",
          err.message,
          `member id ${targetMember.id} in guild id ${guild.id}`
        )
      );

    if (!success) {
      await interaction.editReply({
        content: `Failed to unmute ${targetMember.user.username}`,
      });
      return;
    }

    await updateHistory(Becca, "unmute", target.id, guild.id);

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "unmute",
      target,
      reason
    );

    const muteEmbed = new EmbedBuilder();
    muteEmbed.setTitle(t("commands:mod.unmute.title"));
    muteEmbed.setDescription(
      t("commands:mod.unmute.description", {
        user: member.user.username,
      })
    );
    muteEmbed.setColor(Becca.colours.success);
    muteEmbed.addFields([
      {
        name: t("commands:mod.unmute.reason"),
        value: customSubstring(reason, 1000),
      },
      {
        name: t("commands:mod.unmute.notified"),
        value: String(sentNotice),
      },
    ]);
    muteEmbed.setFooter({ text: `ID: ${targetMember.id}` });
    muteEmbed.setTimestamp();
    muteEmbed.setAuthor({
      name: target.tag,
      iconURL: target.displayAvatarURL(),
    });

    await sendLogEmbed(Becca, guild, muteEmbed, "moderation_events");

    await interaction.editReply({
      content: t("commands:mod.unmute.success"),
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "unmute command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "unmute", errorId, t)],
    });
  }
};
