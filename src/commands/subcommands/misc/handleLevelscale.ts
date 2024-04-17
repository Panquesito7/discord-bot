import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from "discord.js";
import { TFunction } from "i18next";

import levelScale from "../../../config/listeners/levelScale";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const formatLevels = (page: number, t: TFunction) => {
  let formattedText = "";
  for (let i = page * 10 - 9; i <= page * 10; i++) {
    formattedText += t("commands:misc.level.format", {
      level: i,
      xp: levelScale[i],
    });
  }
  return formattedText;
};

/**
 * Generates a paginated embed containing the level scale.
 */
export const handleLevelscale: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    let page = 1;
    const lastPage = Math.ceil((Object.keys(levelScale).length - 1) / 10);

    const embed = new EmbedBuilder();
    embed.setTitle(t("commands:misc.level.title"));
    embed.setURL(
      "https://becca.nhcarrigan.com/#/level-scale?utm_source=discord&utm_medium=levelscale-command"
    );
    embed.setDescription(
      t("commands:misc.level.description", {
        levels: formatLevels(1, t),
      })
    );
    embed.setColor(Becca.colours.default);
    embed.setTimestamp();
    embed.setFooter({
      text: t("commands:misc.level.footer", {
        page,
        pages: lastPage,
      }),
    });

    const pageBack = new ButtonBuilder()
      .setCustomId("prev")
      .setDisabled(true)
      .setLabel("◀")
      .setStyle(ButtonStyle.Primary);

    const pageForward = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("▶")
      .setStyle(ButtonStyle.Primary);

    const sent = (await interaction.editReply({
      embeds: [embed],
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          pageBack,
          pageForward
        ),
      ],
    })) as Message;

    const componentCollector = sent.createMessageComponentCollector({
      time: 30000,
      filter: (click) => click.user.id === interaction.user.id,
    });

    componentCollector.on("collect", async (click) => {
      click.deferUpdate();
      if (click.customId === "prev") {
        page--;
      }
      if (click.customId === "next") {
        page++;
      }

      if (page <= 1) {
        pageBack.setDisabled(true);
      } else {
        pageBack.setDisabled(false);
      }
      if (page >= lastPage) {
        pageForward.setDisabled(true);
      } else {
        pageForward.setDisabled(false);
      }

      embed.setDescription(
        t("commands:misc.level.description", {
          levels: formatLevels(page, t),
        })
      );
      embed.setFooter({
        text: t("commands:misc.level.footer", {
          page,
          pages: lastPage,
        }),
      });

      await interaction.editReply({
        embeds: [embed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });

    componentCollector.on("end", async () => {
      pageBack.setDisabled(true);
      pageForward.setDisabled(true);
      await interaction.editReply({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            pageBack,
            pageForward
          ),
        ],
      });
    });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "levelscale command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "levelscale", errorId, t)],
    });
  }
};
