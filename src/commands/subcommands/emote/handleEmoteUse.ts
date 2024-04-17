import {
  EmoteAction,
  smackList,
  throwList,
} from "../../../config/commands/emoteData";
import { CommandHandler } from "../../../interfaces/commands/CommandHandler";
import { errorEmbedGenerator } from "../../../modules/commands/errorEmbedGenerator";
import { getOptOutRecord } from "../../../modules/listeners/getOptOutRecord";
import { beccaErrorHandler } from "../../../utils/beccaErrorHandler";
import { getRandomValue } from "../../../utils/getRandomValue";
import { tFunctionArrayWrapper } from "../../../utils/tFunctionWrapper";
import { isEmoteAction } from "../../../utils/typeGuards";

/**
 * Handles the logic for using an emote.
 */
export const handleEmoteUse: CommandHandler = async (Becca, interaction, t) => {
  try {
    const action = interaction.options.getString("emote", true) as EmoteAction;
    const target = interaction.options.getUser("target", true);

    const optout = await getOptOutRecord(Becca, interaction.user.id);

    if (!optout || optout.emote) {
      await interaction.editReply(t("commands:emote.use.optout"));
      return;
    }

    if (target.id === interaction.user.id) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noEmoteSelf"),
      });
      return;
    }

    if (target.id === Becca.configs.id) {
      await interaction.editReply({
        content: tFunctionArrayWrapper(t, "responses:noEmoteBecca"),
      });
      return;
    }

    if (!isEmoteAction(action)) {
      await interaction.editReply({
        content: t("commands:emote.use.null"),
      });
      return;
    }

    const createData = {
      userId: target.id,
      userName: target.username,
      avatar: target.displayAvatarURL(),
      hug: 0,
      kiss: 0,
      pat: 0,
      boop: 0,
      smack: 0,
      throw: 0,
      uwu: 0,
    };
    createData[action] = 1;

    const targetData = await Becca.db.emotecounts.upsert({
      where: {
        userId: target.id,
      },
      update: {
        userName: target.username,
        avatar: target.displayAvatarURL(),
        [action]: {
          increment: 1,
        },
      },
      create: createData,
    });

    const tVariables = {
      user: `<@!${target.id}>`,
      count: targetData[action],
      item: "",
    };
    if (action === "smack") {
      tVariables.item = getRandomValue(smackList);
    }
    if (action === "throw") {
      tVariables.item = getRandomValue(throwList);
    }
    const result = t(`commands:emote.use.${action}`, tVariables);

    await interaction.editReply({ content: result });
  } catch (err) {
    const errorId = await beccaErrorHandler(
      Becca,
      "emote use command",
      err,
      interaction.guild?.name,
      undefined,
      interaction
    );
    await interaction.editReply({
      embeds: [errorEmbedGenerator(Becca, "emote use", errorId, t)],
    });
  }
};
