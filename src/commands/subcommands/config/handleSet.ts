import { EmbedBuilder, PermissionFlagsBits } from "discord.js";

import { SettingsPermissions } from "../../../config/commands/settingsPermissions";
import { SettingsHandler } from "../../../interfaces/settings/SettingsHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { renderSetting } from "../../../modules/settings/renderSetting";
import { setSetting } from "../../../modules/settings/setSetting";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { customSubstring } from "../../../utils/customSubstring";
import { FetchWrapper } from "../../../utils/FetchWrapper";

/**
 * Provided the `value` is valid, sets the given `setting` to that `value`.
 */
export const handleSet: SettingsHandler = async (
  Becca,
  interaction,
  t,
  config,
  setting,
  value
) => {
  try {
    const { guild } = interaction;

    const needsPerms = SettingsPermissions[setting];
    const isNotChannel = needsPerms?.includes("ManageRoles");
    const beccaUser = await guild.members.fetchMe();

    if (
      isNotChannel &&
      needsPerms &&
      !needsPerms.every((perm) =>
        beccaUser.permissions.has(PermissionFlagsBits[perm])
      )
    ) {
      await interaction.editReply({
        content: t("commands:config.set.noPerms", {
          permission: needsPerms.join(", "),
        }),
      });
      return;
    }

    if (needsPerms && !isNotChannel) {
      const channel = await FetchWrapper.channel(guild, value);
      if (!channel) {
        await interaction.editReply({
          content: t("commands:config.set.invalid", {
            setting,
            value,
          }),
        });
        return;
      }

      if (
        !needsPerms.every((perm) =>
          beccaUser.permissionsIn(channel).has(PermissionFlagsBits[perm])
        )
      ) {
        await interaction.editReply({
          content: t("commands:config.set.noChannelPerms", {
            permission: needsPerms.join(", "),
            channel: channel.name,
          }),
        });
        return;
      }
    }

    if (
      setting === "level_roles" &&
      interaction.options.getRole("role", true).position >
        beccaUser.roles.highest.position
    ) {
      await interaction.editReply({
        content: t("commands:config.set.roleNotManagable", {
          role: value.split(" ")[1],
        }),
      });
      return;
    }

    const isSet = await setSetting(Becca, guild.name, setting, value, config);

    if (!isSet) {
      await interaction.editReply(t("commands:config.set.failed"));
      return;
    }
    const newContent = isSet[setting];
    const parsedContent = renderSetting(Becca, setting, newContent);
    const successEmbed = new EmbedBuilder();
    successEmbed.setTitle(t("commands:config.set.title", { setting }));
    successEmbed.setDescription(
      customSubstring(parsedContent, 2000) || "no setting found"
    );
    successEmbed.setTimestamp();
    successEmbed.setColor(Becca.colours.default);
    successEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });
    await interaction.editReply({ embeds: [successEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "set command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "set", errorId, t)],
    });
  }
};
