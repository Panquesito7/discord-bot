import {
  ModerationActions,
  ModerationActionsPlural,
} from "../interfaces/commands/moderation/ModerationActions";
import {
  BotActivity,
  BotActivityPlural,
} from "../interfaces/listeners/BotActivity";

/**
 * Pluralises a bot activity.
 *
 * @param {BotActivity} activity The activity to pluralise.
 * @returns {BotActivityPlural} The plural form of the activity.
 */
export const botActivityToPlural = (
  activity: BotActivity
): BotActivityPlural => {
  const converter: { [key in BotActivity]: BotActivityPlural } = {
    button: "buttons",
    command: "commands",
    context: "contexts",
    select: "selects",
  };
  return converter[activity];
};

/**
 * Pluralises a mod action..
 *
 * @param {ModerationActions} action The action to pluralise.
 * @returns {ModerationActionsPlural} The plural form of the action.
 */
export const modActionToPlural = (
  action: ModerationActions
): ModerationActionsPlural => {
  const converter: { [key in ModerationActions]: ModerationActionsPlural } = {
    ban: "bans",
    kick: "kicks",
    mute: "mutes",
    warn: "warns",
    unban: "unbans",
    unmute: "unmutes",
  };
  return converter[action];
};
