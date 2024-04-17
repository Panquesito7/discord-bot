import { servers } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import {
  AntiphishSettings,
  ArrayOfIdSettings,
  ArrayOfLevelRoleSettings,
  ArrayOfStringSettings,
  IdSettings,
  NumberSettings,
  Settings,
  StringSettings,
  StyleSettings,
} from "../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import {
  isAntiphishSettingValue,
  isStyleSettingValue,
} from "../../utils/typeGuards";

/**
 * Updates a setting in the database.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {servers} server The new settings record.
 * @param {Settings} key The name of the setting to modify.
 */
const updateDatabase = async (
  Becca: BeccaLyria,
  server: servers,
  key: Settings
) => {
  try {
    await Becca.db.servers.update({
      where: {
        serverID: server.serverID,
      },
      data: {
        [key]: server[key],
      },
    });
  } catch (err) {
    await beccaErrorHandler(Becca, "update database settings", err);
  }
};

const setArrayOfIdSetting = (
  server: servers,
  key: ArrayOfIdSettings,
  value: string
) => {
  const parsedValue = value.replace(/\D/g, "");
  if (server[key].includes(parsedValue)) {
    const index = server[key].indexOf(parsedValue);
    server[key].splice(index, 1);
  } else {
    server[key].push(parsedValue);
  }
};

const setArrayOfStringSetting = (
  server: servers,
  key: ArrayOfStringSettings,
  value: string
) => {
  if (server[key].includes(value)) {
    const index = server[key].indexOf(value);
    server[key].splice(index, 1);
  } else {
    server[key].push(value);
  }
};

const setArrayOfLevelRoleSetting = (
  server: servers,
  key: ArrayOfLevelRoleSettings,
  value: string
) => {
  const [level, role] = value.split(" ");
  const hasSetting = server[key].findIndex(
    (el) =>
      el.role === role.replace(/\D/g, "") && el.level === parseInt(level, 10)
  );
  if (hasSetting === -1) {
    server[key].push({
      level: parseInt(level, 10),
      role: role.replace(/\D/g, ""),
    });
  } else {
    server[key].splice(hasSetting, 1);
  }
};

const setStringSetting = (
  server: servers,
  key: StringSettings,
  value: string
) => {
  server[key] = value;
};

const setNumberSetting = (
  server: servers,
  key: NumberSettings,
  value: string
) => {
  server[key] = parseInt(value, 10);
};

const setAntiphishSetting = (
  server: servers,
  key: AntiphishSettings,
  value: string
) => {
  if (!isAntiphishSettingValue(value)) {
    server[key] = "none";
    return;
  }
  server[key] = value;
};

const setStyleSetting = (
  server: servers,
  key: StyleSettings,
  value: string
) => {
  if (!isStyleSettingValue(value)) {
    server[key] = "embed";
    return;
  }
  server[key] = value;
};

const setIdSetting = (server: servers, key: IdSettings, value: string) => {
  const parsedValue = value.replace(/\D/g, "");
  server[key] = parsedValue;
};

export const settingsSetters = {
  setArrayOfIdSetting,
  setArrayOfStringSetting,
  setArrayOfLevelRoleSetting,
  setStringSetting,
  setNumberSetting,
  setAntiphishSetting,
  setStyleSetting,
  setIdSetting,
  updateDatabase,
};
