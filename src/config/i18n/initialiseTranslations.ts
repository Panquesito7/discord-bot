import { init } from "i18next";

import enGbCommands from "./en-GB/commands.json";
import enGbContexts from "./en-GB/contexts.json";
import enGbDefaults from "./en-GB/defaults.json";
import enGbEvents from "./en-GB/events.json";
import enGbListeners from "./en-GB/listeners.json";
import enGbResponses from "./en-GB/responses.json";
import enGbSass from "./en-GB/sass.json";

/**
 * This is only exported to be used in the type declaration file.
 * Knip doesn't like that, so here's a JSDoc tag to fix it.
 *
 * @public
 */
export const resources = {
  "en-GB": {
    commands: enGbCommands,
    contexts: enGbContexts,
    defaults: enGbDefaults,
    events: enGbEvents,
    listeners: enGbListeners,
    responses: enGbResponses,
    sass: enGbSass,
  },
};

/**
 * Function to initialise the i18n plugin, loading the responses.
 */
export const initialiseTranslations = async (): Promise<void> => {
  await init({
    fallbackLng: "en-GB",
    ns: [
      "responses",
      "sass",
      "defaults",
      "contexts",
      "events",
      "listeners",
      "commands",
    ],
    returnObjects: true,
    returnNull: false,
    resources,
  });
};
