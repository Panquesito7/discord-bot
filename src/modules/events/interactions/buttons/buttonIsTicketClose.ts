import { EmbedBuilder, PermissionFlagsBits, TextChannel } from "discord.js";

import { ButtonHandler } from "../../../../interfaces/buttons/ButtonHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../../utils/FetchWrapper";
import { tFunctionArrayWrapper } from "../../../../utils/tFunctionWrapper";
import { getSettings } from "../../../settings/getSettings";
import { generateLogs } from "../../../tickets/generateTicketLog";

export const buttonIsTicketClose: ButtonHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    await interaction.deferReply({ ephemeral: true });
    const { guild, member, channel } = interaction;

    if (!channel) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:missingGuild"),
      });
      return;
    }

    const config = await getSettings(Becca, guild.id, guild.name);

    if (!config) {
      await interaction.reply({
        content: t<string, string>("events:interaction.noSettings"),
      });
      return;
    }

    const isStaff = member.permissions.has(PermissionFlagsBits.ManageMessages);
    if (!isStaff) {
      await interaction.editReply({
        content: "Only staff members can claim a ticket.",
      });
      return;
    }

    const logEmbed = new EmbedBuilder();
    logEmbed.setTitle("Ticket Closed");
    logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
    logEmbed.addFields({
      name: "User",
      value:
        (channel as TextChannel)?.name.split("-").slice(1).join("-") ||
        "unknown",
    });

    if (config.ticket_log_channel) {
      const logEmbed = new EmbedBuilder();
      logEmbed.setTitle("Ticket Closed");
      logEmbed.setDescription(`Ticket closed by <@!${member.user.id}>`);
      logEmbed.addFields({
        name: "User",
        value:
          (channel as TextChannel)?.name.split("-").slice(1).join("-") ||
          "unknown",
      });

      const logFile = await generateLogs(Becca, guild.id, channel.id);
      const logChannel = await FetchWrapper.channel(
        guild,
        config.ticket_log_channel
      );

      if (logChannel?.isTextBased()) {
        await logChannel.send({
          embeds: [logEmbed],
          files: [logFile],
        });
      }
    }

    await channel.delete();
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "close ticket button",
      err,
      interaction.guild?.name
    );
  }
};
