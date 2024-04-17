import { servers } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import { beccaLogHandler } from "../../utils/beccaLogHandler";
import {
  isAntiphishSetting,
  isChannelIdArraySetting,
  isChannelIdSetting,
  isLevelRoleArraySetting,
  isNumberSetting,
  isRoleIdArraySetting,
  isRoleIdSetting,
  isStringArraySetting,
  isStringSetting,
  isStyleSetting,
  isUserIdArraySetting,
} from "../../utils/typeGuards";

import { settingsSetters } from "./settingsSetters";

/**
 * This handles all of the logic for setting a server's config. Depending on
 * the type of the data stored, it will handle the array or string logic
 * as necessary.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} serverName The current name of the server.
 * @param {keyof servers} key The name of the setting to modify.
 * @param {string} value The value to change the setting to.
 * @param {servers} server The server config entry in the database.
 * @returns {servers | null} ServerModel on success and null on error.
 */
export const setSetting = async (
  Becca: BeccaLyria,
  serverName: string,
  key: keyof servers,
  value: string,
  server: servers
): Promise<servers | null> => {
  try {
    if (
      isUserIdArraySetting(key) ||
      isChannelIdArraySetting(key) ||
      isRoleIdArraySetting(key)
    ) {
      settingsSetters.setArrayOfIdSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isStyleSetting(key)) {
      settingsSetters.setStyleSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isStringArraySetting(key)) {
      settingsSetters.setArrayOfStringSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isLevelRoleArraySetting(key)) {
      settingsSetters.setArrayOfLevelRoleSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isStringSetting(key)) {
      settingsSetters.setStringSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isNumberSetting(key)) {
      settingsSetters.setNumberSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isAntiphishSetting(key)) {
      settingsSetters.setAntiphishSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    if (isChannelIdSetting(key) || isRoleIdSetting(key)) {
      settingsSetters.setIdSetting(server, key, value);
      await settingsSetters.updateDatabase(Becca, server, key);
      return server;
    }
    beccaLogHandler.log("error", "The settings set logic broke horribly.");
    return server;
  } catch (err) {
    await beccaErrorHandler(Becca, "set setting module", err, serverName);
    return null;
  }
};
