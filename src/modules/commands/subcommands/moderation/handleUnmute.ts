/* eslint-disable jsdoc/require-param */
/* eslint-disable */
import { MessageEmbed } from "discord.js";

import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../../utils/customSubstring";
import { getRandomValue } from "../../../../utils/getRandomValue";
import { sendModerationDm } from "../../../../utils/sendModerationDm";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";
import { sendLogEmbed } from "../../../guild/sendLogEmbed";
import { updateHistory } from "../../moderation/updateHistory";

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

    if (!guild) {
      await interaction.editReply({
        content: getRandomValue(t("responses:missingGuild")),
      });
      return;
    }

    if (
      !member ||
      typeof member.permissions === "string" ||
      !member.permissions.has("MODERATE_MEMBERS")
    ) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noPermission")),
      });
      return;
    }

    if (target.id === member.user.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noModSelf")),
      });
      return;
    }
    if (target.id === Becca.user?.id) {
      await interaction.editReply({
        content: getRandomValue(t("responses:noModBecca")),
      });
      return;
    }

    const targetUser = await guild.members.fetch(target.id);

    await targetUser.timeout(null, reason);

    await updateHistory(Becca, "unmute", target.id, guild.id);

    const sentNotice = await sendModerationDm(
      Becca,
      config,
      t,
      "unmute",
      target,
      reason
    );

    const muteEmbed = new MessageEmbed();
    muteEmbed.setTitle(t("commands:mod.unmute.title"));
    muteEmbed.setDescription(
      t("commands:mod.unmute.description", { user: member.user.username })
    );
    muteEmbed.setColor(Becca.colours.success);
    muteEmbed.addField(
      t("commands:mod.unmute.reason"),
      customSubstring(reason, 1000)
    );
    muteEmbed.addField(t("commands:mod.unmute.notified"), String(sentNotice));
    muteEmbed.setFooter(`ID: ${targetUser.id}`);
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
