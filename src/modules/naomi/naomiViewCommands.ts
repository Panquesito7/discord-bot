import { EmbedBuilder, Message, REST, Routes } from "discord.js";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { CommandData } from "../../interfaces/commands/CommandData";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * Owner-only module to view the current list of commands.
 *
 * @param {BeccaLyria} Becca Becca's discord instance.
 * @param {Message} message The message payload from Discord.
 */
export const naomiViewCommands = async (
  Becca: BeccaLyria,
  message: Message
) => {
  try {
    const rest = new REST({ version: "10" }).setToken(Becca.configs.token);

    const commands: CommandData[] = (await rest.get(
      Routes.applicationCommands(Becca.configs.id)
    )) as CommandData[];

    if (!commands.length) {
      await message.reply(
        "It seems I do not have any spells prepared at this time."
      );
      return;
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Available Spells");
    embed.setDescription("These are the spells I currently have prepared.");
    embed.addFields(
      commands.map((el) => ({
        name: el.name,
        value: el.options
          ? el.options?.map((opt) => opt.name).join(", ")
          : "This spell has no options.",
      }))
    );

    await message.reply({ embeds: [embed] });
  } catch (err) {
    await beccaErrorHandler(
      Becca,
      "view slash command",
      err,
      message.guild?.name,
      message
    );
  }
};
