import { RewriteFrames } from "@sentry/integrations";
import { init } from "@sentry/node";
import { ActivityType, Client } from "discord.js";

import { initialiseTranslations } from "./config/i18n/initialiseTranslations";
import { IntentOptions } from "./config/IntentOptions";
import { connectPrisma } from "./database/connectPrisma";
import { handleEvents } from "./events/handleEvents";
import { BeccaLyria } from "./interfaces/BeccaLyria";
import { prepareBecca } from "./modules/prepareBecca";
import { createServer } from "./server/serve";
import { beccaErrorHandler } from "./utils/beccaErrorHandler";
import { beccaLogHandler } from "./utils/beccaLogHandler";
import { loadCommands } from "./utils/loadCommands";
import { loadContexts } from "./utils/loadContexts";
import { registerCommands } from "./utils/registerCommands";

init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
  release: `becca-lyria-bot@v${process.env.npm_package_version}`,
  environment: "production",
});

/**
 * This is the entry point for Becca's process. This will log the boot process,
 * call the necessary helpers to prepare Becca, and then log in to Discord.
 */
// skipcq: JS-0098
void (async () => {
  beccaLogHandler.log("debug", "Starting process...");

  await initialiseTranslations();

  beccaLogHandler.log("debug", "Loaded i18n!");

  const Becca = new Client({
    shards: "auto",
    intents: IntentOptions,
  }) as BeccaLyria;

  beccaLogHandler.log("debug", "Validating environment variables...");
  prepareBecca(Becca);

  /**
   * Fallthrough error handlers. These fire in rare cases where something throws
   * in a way that our standard catch block cannot see it.
   */
  process.on("unhandledRejection", async (error: Error) => {
    await beccaErrorHandler(
      Becca,
      "Unhandled Rejection Error",
      error,
      undefined,
      undefined,
      undefined
    );
  });

  process.on("uncaughtException", async (error) => {
    await beccaErrorHandler(
      Becca,
      "Uncaught Exception Error",
      error,
      undefined,
      undefined,
      undefined
    );
  });

  beccaLogHandler.log("debug", "Initialising web server...");
  const server = await createServer(Becca);
  if (!server) {
    beccaLogHandler.log("error", "failed to launch web server.");
    return;
  }

  beccaLogHandler.log("debug", "Importing commands...");
  const commands = await loadCommands(Becca);
  const contexts = await loadContexts(Becca);
  if (!commands || !contexts) {
    beccaLogHandler.log("error", "failed to import commands.");
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    beccaLogHandler.log("debug", "Registering commands in development...");
    const success = await registerCommands(Becca);
    if (!success) {
      beccaLogHandler.log("error", "failed to register commands.");
      return;
    }
  }

  beccaLogHandler.log("debug", "Initialising database...");
  const databaseConnection = await connectPrisma(Becca);
  if (!databaseConnection) {
    beccaLogHandler.log("error", "failed to connect to database.");
    return;
  }

  beccaLogHandler.log("debug", "Attaching event listeners...");
  handleEvents(Becca);

  beccaLogHandler.log("debug", "Connecting to Discord...");
  await Becca.login(Becca.configs.token);
  beccaLogHandler.log("debug", "Setting activity...");
  Becca.user?.setActivity({
    name: "Custom Status",
    type: ActivityType.Custom,
    state:
      "💜 Keeping your community safe! Get support at https://chat.nhcarrigan.com",
  });
})();
