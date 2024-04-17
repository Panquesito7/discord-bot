import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Role } from "discord.js";

import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";

/**
 * Handles the logic for creating a reaction role post.
 */
export const handleCreate: CommandHandler = async (Becca, interaction, t) => {
  try {
    const channel = interaction.options.getChannel("channel", true);
    const title = interaction.options.getString("header", true);

    if (!("send" in channel)) {
      await interaction.editReply(t("commands:reactionrole.create.channel"));
      return;
    }
    const roleArray = [
      interaction.options.getRole("role1", true),
      interaction.options.getRole("role2"),
      interaction.options.getRole("role3"),
      interaction.options.getRole("role4"),
      interaction.options.getRole("role5"),
      interaction.options.getRole("role6"),
      interaction.options.getRole("role7"),
      interaction.options.getRole("role8"),
      interaction.options.getRole("role9"),
      interaction.options.getRole("role10"),
      interaction.options.getRole("role11"),
      interaction.options.getRole("role12"),
      interaction.options.getRole("role13"),
      interaction.options.getRole("role14"),
      interaction.options.getRole("role15"),
      interaction.options.getRole("role16"),
      interaction.options.getRole("role17"),
      interaction.options.getRole("role18"),
      interaction.options.getRole("role19"),
      interaction.options.getRole("role20"),
    ].filter((el) => el) as Role[];

    const dividedRoles: Role[][] = [];
    while (roleArray.length) {
      dividedRoles.push(roleArray.splice(0, 5));
    }

    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    for (const roleBlock of dividedRoles) {
      const buttons = roleBlock.map((el) =>
        new ButtonBuilder()
          .setLabel(el.name)
          .setCustomId(`rr-${el.id}`)
          .setStyle(ButtonStyle.Secondary)
      );
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);
      components.push(row);
    }

    await channel.send({
      content: title,
      components,
    });

    await interaction.editReply(t("commands:reactionrole.create.success"));
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reactionrole create",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reactionrole create", errorId, t)],
    });
  }
};
