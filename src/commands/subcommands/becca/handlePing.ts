import { EmbedBuilder } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Generates an embed with Becca's response time.
 */
export const handlePing: CommandHandler = async (
  Becca,
  interaction,
  t
): Promise<void> => {
  try {
    const receivedInteraction = Date.now();
    const { createdTimestamp } = interaction;

    const discordLatency = receivedInteraction - createdTimestamp;
    const websocketLatency = Becca.ws.ping;

    await Becca.db.$runCommandRaw({ ping: 1 });
    const databaseLatency = Date.now() - receivedInteraction;

    const isSlow =
      discordLatency > 100 || websocketLatency > 100 || databaseLatency > 100;

    const pingEmbed = new EmbedBuilder();
    pingEmbed.setTitle(t("commands:becca.ping.title"));
    pingEmbed.setDescription(t("commands:becca.ping.description"));
    pingEmbed.addFields([
      {
        name: t("commands:becca.ping.interaction"),
        value: `${discordLatency} ms`,
        inline: true,
      },
      {
        name: t("commands:becca.ping.websocket"),
        value: `${websocketLatency} ms`,
        inline: true,
      },
      {
        name: t("commands:becca.ping.databaase"),
        value: `${databaseLatency} ms`,
        inline: true,
      },
    ]);
    pingEmbed.setColor(isSlow ? Becca.colours.error : Becca.colours.success);

    await interaction.editReply({ embeds: [pingEmbed] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "ping command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "ping", errorId, t)],
    });
  }
};
