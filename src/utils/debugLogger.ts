import { beccaLogHandler } from "./beccaLogHandler";

/**
 * Logs debug messages in a standardised format to the console.
 *
 * @param {string} context The function name where the debug message was generated.
 * @param {string} message The error message to log.
 * @param {string} source The source of the error.
 * @returns {null} A null value for type safety.
 * @example debugLogger("level listener", err.message, message.guild?.name)
 */
export const debugLogger = (
  context: string,
  message: string,
  source: string
): null => {
  beccaLogHandler.log(
    "debug",
    `Debug message from ${context} in ${source}: ${message}`
  );
  return null;
};
