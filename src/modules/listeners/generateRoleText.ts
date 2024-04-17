import { Role, User } from "discord.js";

/**
 * Generates role text from a given template.
 *
 * @param {string} template The template to use.
 * @param {User} user The user that levelled up.
 * @param {Role} role The user's new role.
 * @returns {string} The generated level text.
 */
export const generateRoleText = (
  template: string,
  user: User,
  role: Role
): string => {
  return template
    .replace(/\{user\}/g, user.username)
    .replace(/\{role\}/g, role.name)
    .replace(/\{@user}/g, `<@${user.id}>`)
    .replace(/\{@role\}/g, `<@&${role.id}>`);
};
