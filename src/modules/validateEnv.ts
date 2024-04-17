import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaLogHandler } from "../utils/beccaLogHandler";

/**
 * Validates that all expected environment variables are set with *some* value.
 * Does not validate that the values are valid. Constructs a config object and
 * returns it. Terminates the process on missing values.
 *
 * @returns {BeccaLyria["configs"]} Becca's config object.
 */
// skipcq: JS-0044
export const validateEnv = (): BeccaLyria["configs"] => {
  /* We skip the cyclomatic complexity check as the complexity
 is needed for the detailed error messages. */
  if (!process.env.DISCORD_TOKEN) {
    beccaLogHandler.log("error", "Missing Discord token");
    process.exit(1);
  }

  if (!process.env.MONGODB) {
    beccaLogHandler.log("error", "Missing MongoDB connection string");
    process.exit(1);
  }

  if (!process.env.WH_URL) {
    beccaLogHandler.log("error", "Missing Discord webhook URL");
    process.exit(1);
  }

  if (!process.env.FEEDBACK_WH) {
    beccaLogHandler.log("error", "Missing Discord Feedback webhook URL");
    process.exit(1);
  }

  if (!process.env.OWNER_ID) {
    beccaLogHandler.log("error", "Missing Bot Owner ID");
    process.exit(1);
  }

  if (!process.env.CLIENT_ID) {
    beccaLogHandler.log("error", "Missing Bot Client ID");
    process.exit(1);
  }

  if (!process.env.HOME_GUILD_ID) {
    beccaLogHandler.log("error", "Missing Bot Home Guild ID");
    process.exit(1);
  }

  if (!process.env.SUPPORT_ROLE_ID) {
    beccaLogHandler.log("error", "Missing Support Role ID");
    process.exit(1);
  }

  return {
    token: process.env.DISCORD_TOKEN,
    dbToken: process.env.MONGODB,
    whUrl: process.env.WH_URL,
    feedbackUrl: process.env.FEEDBACK_WH,
    nasaKey: process.env.NASA_API || "",
    ownerId: process.env.OWNER_ID,
    love: process.env.BECCA_LOVE || "💜",
    yes: process.env.BECCA_YES || "✅",
    no: process.env.BECCA_NO || "❌",
    think: process.env.BECCA_THINK || "🤔",
    version: process.env.npm_package_version || "null",
    id: process.env.CLIENT_ID,
    homeGuild: process.env.HOME_GUILD_ID,
    supportRole: process.env.SUPPORT_ROLE_ID,
    announcementChannel: process.env.ANNOUNCEMENT_CHANNEL_ID || "",
    topGGToken: process.env.TOPGG_TOKEN || "",
    topGG: process.env.TOPGG_PASSWORD || "",
    voteChannel: process.env.VOTE_CHANNEL_ID || "",
    analyticsSecret: process.env.ANALYTICS_SECRET || "test_secret",
    analyticsUrl: process.env.ANALYTICS_URL || "http://localhost:3000",
  };
};
