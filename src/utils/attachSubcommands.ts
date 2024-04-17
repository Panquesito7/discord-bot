import {
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";

/**
 * Takes a slash command group builder and a list of subcommands,
 * attaches the subcommands to the builder, and returns the builder.
 *
 * @param {SlashCommandSubcommandGroupBuilder} command The command to use as the root.
 * @param {SlashCommandSubcommandBuilder[]} subcommands The subcommands to attach.
 * @param {boolean} stripOpts Whether to strip the options from the subcommands.
 * @returns {SlashCommandSubcommandGroupBuilder} The command with the subcommands attached.
 */
export const attachSubcommandsToGroup = (
  command: SlashCommandSubcommandGroupBuilder,
  subcommands: SlashCommandSubcommandBuilder[],
  stripOpts = false
): SlashCommandSubcommandGroupBuilder => {
  for (const subcommand of subcommands) {
    stripOpts
      ? command.addSubcommand(
          new SlashCommandSubcommandBuilder()
            .setName(subcommand.name)
            .setDescription(subcommand.description)
        )
      : command.addSubcommand(subcommand);
  }
  return command;
};
