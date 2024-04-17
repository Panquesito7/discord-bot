import { ButtonHandler } from "../../../../interfaces/buttons/ButtonHandler";
import { beccaErrorHandler } from "../../../../utils/beccaErrorHandler";
import { FetchWrapper } from "../../../../utils/FetchWrapper";
import { errorEmbedGenerator } from "../../../commands/errorEmbedGenerator";

export const buttonIsReaction: ButtonHandler = async (
  Becca,
  interaction,
  t
) => {
  try {
    const { guild, customId, member } = interaction;
    const roleId = customId.split("-")[1];
    const role = await FetchWrapper.role(guild, roleId);

    if (!role) {
      await interaction.editReply(t("events:interaction.noRole"));
      return;
    }

    let content = "";

    if (member.roles.cache.has(role.id)) {
      const success = await member.roles.remove(role).catch(() => false);
      content = success
        ? t("events:interaction.removedRole")
        : t("events:interaction.failedRole");
    } else {
      const success = await member.roles.add(role).catch(() => false);
      content = success
        ? t("events:interaction.addedRole")
        : t("events:interaction.failedRole");
    }
    await interaction.editReply({ content });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "reaction button",
      err,
      interaction.guild?.name
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "reaction button", errorId, t)],
    });
  }
};
