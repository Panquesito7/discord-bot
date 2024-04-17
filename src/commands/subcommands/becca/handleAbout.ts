import { exec } from "child_process";
import { readFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { getCounts } from "../../../modules/becca/getCounts";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

const asyncExec = promisify(exec);

/**
 * Generates an embed containing information about Becca.
 */
export const handleAbout: CommandHandler = async (Becca, interaction, t) => {
  try {
    const { commitHash: hash } = Becca;
    const { guilds, members, commands } = getCounts(Becca);

    const { stdout } = await asyncExec("cloc --csv --quiet src");
    const lines = stdout.split("\n").slice(1);
    const typescript = lines.find((line) => line.includes("TypeScript"));
    const [files, code] = typescript
      ? [typescript.split(",")[0], typescript.split(",")[4]]
      : ["unknown", "unknown"];
    const coverageFile = await readFile(
      join(process.cwd(), "coverage", "index.html"),
      "utf-8"
    );
    const coverageTotals = coverageFile.match(
      /<div class='fl pad1y space-right2'>((?!div).)*<\/div>/gs
    );
    const lineTotals = coverageTotals
      ? coverageTotals[3].match(/[\d.]+%/)?.[0] || "0%"
      : "0%";

    const aboutEmbed = new EmbedBuilder();
    aboutEmbed.setColor(Becca.colours.default);
    aboutEmbed.setTitle(t("commands:becca.about.title"));
    aboutEmbed.setDescription(t("commands:becca.about.description"));
    aboutEmbed.addFields([
      {
        name: t("commands:becca.about.version"),
        value: `${
          process.env.npm_package_version || "unknown version"
        } - [${hash.slice(
          0,
          7
        )}](https://github.com/beccalyria/discord-bot/commit/${hash})`,
        inline: true,
      },
      {
        name: t("commands:becca.about.creation"),
        value: "Sunday, 31 May 2020",
        inline: true,
      },
      {
        name: t("commands:becca.about.guilds"),
        value: guilds.toString(),
        inline: true,
      },
      {
        name: t("commands:becca.about.members"),
        value: members.toString(),
        inline: true,
      },
      {
        name: t("commands:becca.about.commands"),
        value: commands.toString(),
        inline: true,
      },
      {
        name: t("commands:becca.about.language"),
        value: t("commands:becca.about.typescript"),
        inline: true,
      },
      {
        name: t("commands:becca.about.files"),
        value: files,
        inline: true,
      },
      {
        name: t("commands:becca.about.lines"),
        value: code,
        inline: true,
      },
      {
        name: t("commands:becca.about.coverage"),
        value: lineTotals,
        inline: true,
      },
    ]);
    aboutEmbed.setFooter({
      text: t("defaults:footer"),
      iconURL: "https://cdn.nhcarrigan.com/profile.png",
    });

    const supportServerButton = new ButtonBuilder()
      .setLabel(t("commands:becca.about.buttons.join"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://chat.nhcarrigan.com");
    const inviteButton = new ButtonBuilder()
      .setLabel(t("commands:becca.about.buttons.invite"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://invite.beccalyria.com");
    const codeButton = new ButtonBuilder()
      .setLabel(t("commands:becca.about.buttons.code"))
      .setStyle(ButtonStyle.Link)
      .setURL("https://github.com/beccalyria/discord-bot");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
      supportServerButton,
      inviteButton,
      codeButton,
    ]);

    await interaction.editReply({ embeds: [aboutEmbed], components: [row] });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "about command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "about", errorId, t)],
    });
  }
};
