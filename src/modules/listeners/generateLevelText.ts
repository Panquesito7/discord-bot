import { User } from "discord.js";

/**
 * Generates level text from a given template.
 *
 * @param {string} template The template to use.
 * @param {User} user The user that levelled up.
 * @param {number} level The user's new level.
 * @returns {string} The generated level text.
 */
export const generateLevelText = (
  template: string,
  user: User,
  level: number
): string => {
  return template
    .replace(/\{user\}/g, user.username)
    .replace(/\{level\}/g, level.toString())
    .replace(/\{@user}/g, `<@${user.id}>`);
};
