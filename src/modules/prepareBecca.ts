import { execSync } from "child_process";

import { WebhookClient } from "discord.js";

import { BeccaLyria } from "../interfaces/BeccaLyria";

import { validateEnv } from "./validateEnv";

/**
 * Prepares all of Becca's cache and config values.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 */
export const prepareBecca = (Becca: BeccaLyria): void => {
  Becca.commitHash = execSync("git rev-parse HEAD").toString().trim();

  Becca.configs = validateEnv();

  Becca.colours = {
    default: 0x8b4283,
    success: 0x1f8b4c,
    warning: 0xc27c0e,
    error: 0x992d22,
  };
  Becca.debugHook = new WebhookClient({ url: Becca.configs.whUrl });
  Becca.feedbackHook = new WebhookClient({ url: Becca.configs.feedbackUrl });
  Becca.timeOuts = {};
  Becca.cta = {};
};
