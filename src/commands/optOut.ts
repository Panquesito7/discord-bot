import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder,
} from "discord.js";

import { optOutChoices } from "../config/commands/optOutChoices";
import { Command } from "../interfaces/commands/Command";
import { OptOutSettings } from "../interfaces/settings/OptOutSettings";
import { errorEmbedGenerator } from "../modules/commands/errorEmbedGenerator";
import { deleteUserData } from "../modules/commands/optout/deleteUserData";
import { getOptOutRecord } from "../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

export const optOut: Command = {
  data: new SlashCommandBuilder()
    .setName("optout")
    .setDescription("Opt out of data collection.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("data-type")
        .setDescription("The type of data to opt out of.")
        .setRequired(true)
        .addChoices(...optOutChoices)
    ),
  run: async (Becca, interaction, t) => {
    try {
      await interaction.deferReply();

      const record = await getOptOutRecord(Becca, interaction.user.id);

      if (!record) {
        await interaction.editReply({
          content: t("commands:optOut.noRecord"),
        });
        return;
      }

      const unconfirmedType = await interaction.options.getString(
        "data-type",
        true
      );

      if (!(unconfirmedType in record)) {
        await interaction.editReply({
          content: t("commands:optOut.invalidType"),
        });
        return;
      }

      const type = unconfirmedType as OptOutSettings;

      if (record[type]) {
        await Becca.db.optouts.update({
          where: {
            userId: interaction.user.id,
          },
          data: {
            [type]: false,
          },
        });
        await interaction.editReply({
          content: t("commands:optOut.optIn", { type }),
        });
        return;
      }

      const confirmButton = new ButtonBuilder()
        .setLabel("Confirm")
        .setCustomId("confirm")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅");
      const cancelButton = new ButtonBuilder()
        .setLabel("Cancel")
        .setCustomId("cancel")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌");
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        confirmButton,
        cancelButton,
      ]);

      const confirmMessage = await interaction.editReply({
        content: t("commands:optOut.confirm", { type }),
        components: [row],
      });

      const collector =
        confirmMessage.createMessageComponentCollector<ComponentType.Button>({
          filter: (click) => click.user.id === interaction.user.id,
          time: 30000,
          max: 1,
        });

      collector.on("collect", async (click) => {
        if (click.customId === "cancel") {
          await interaction.editReply({
            content: t("commands:optOut.cancelled"),
            components: [],
          });
          return;
        }

        await Becca.db.optouts.update({
          where: {
            userId: interaction.user.id,
          },
          data: {
            [type]: true,
          },
        });

        const deleted = await deleteUserData(Becca, interaction.user.id, type);

        await interaction.editReply({
          content: deleted
            ? t("commands:optOut.success")
            : t("commands:optOut.failure"),
          components: [],
        });
      });

      collector.on("end", async (clicks) => {
        if (clicks.size === 0) {
          await interaction.editReply({
            content: t("commands:optOut.timeout"),
            components: [],
          });
        }
      });
    } catch (err) {
      const errorId = await beccaErrorHandler(
        Becca,
        "opt out command group",
        err,
        interaction.guild?.name,
        undefined,
        interaction
      );
      await interaction.editReply({
        embeds: [errorEmbedGenerator(Becca, "opt out group", errorId, t)],
      });
    }
  },
};
