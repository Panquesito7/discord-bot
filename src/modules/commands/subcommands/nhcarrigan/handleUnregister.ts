/* eslint-disable jsdoc/require-param */
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { MessageEmbed } from "discord.js";

import { CommandData } from "../../../../interfaces/commands/CommandData";
import { CommandHandler } from "../../../../interfaces/commands/CommandHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { errorEmbedGenerator } from "../../errorEmbedGenerator";

/**
 * Removes the given `command` from the list of available commands.
 * Run this if a stray command isn't getting deleted.
 */
export const handleUnregister: CommandHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const target = interaction.options.getString("command", true);

    const targetCommand = Becca.commands.find((el) => el.data.name === target);

    if (!targetCommand) {
      await interaction.editReply(t("commands:nhcarrigan.unregister.missing"));
      return;
    }

    const rest = new REST({ version: "9" }).setToken(Becca.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Becca.configs.id)
    )) as CommandData[];

    const command = commands.find((el) => el.name === targetCommand.data.name);

    if (!command) {
      await interaction.editReply(t("commands:nhcarrigan.unregister.invalid"));
      return;
    }

    await rest.delete(
      `${Routes.applicationCommands(Becca.configs.id)}/${command.id}`
    );

    const confirm = new MessageEmbed();
    confirm.setTitle(
      t("commands:nhcarrigan.unregister.title", { name: command.name })
    );
    confirm.setDescription(command.description);

    if (command.options) {
      for (const option of command.options) {
        confirm.addField(option.name, option.description, true);
      }
    }

    await interaction.editReply({ embeds: [confirm] });
    await Becca.debugHook.send(
      `Hey <@!${Becca.configs.ownerId}>, the ${command.name} command was unregistered.`
    );
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "unregister command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "unregister", errorId, t)],
    });
  }
};
