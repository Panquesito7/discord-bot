import { servers } from "@prisma/client";

import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { Settings } from "../../interfaces/settings/Settings";
import { Trigger } from "../../interfaces/settings/Trigger";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";
import {
  isAntiphishSetting,
  isChannelIdArraySetting,
  isChannelIdSetting,
  isLevelRoleArraySetting,
  isRoleIdArraySetting,
  isRoleIdSetting,
  isStringSetting,
  isStyleSetting,
  isTriggerArraySetting,
  isUserIdArraySetting,
} from "../../utils/typeGuards";

/**
 * Renders a server setting's value into a string in the format that Discord
 * expects - allows for clean formatting of roles and channels.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {Settings} key The setting to render.
 * @param {unknown} value That setting's value.
 * @returns {string} The parsed value.
 */
export const renderSetting = (
  Becca: BeccaLyria,
  key: Settings,
  value: unknown
): string => {
  try {
    if (!value) {
      return "No value set.";
    }
    if (
      isStringSetting(key) ||
      isStyleSetting(key) ||
      isAntiphishSetting(key)
    ) {
      return `${value}`;
    }
    if (isChannelIdSetting(key)) {
      return `<#${value}>`;
    }
    if (isRoleIdSetting(key)) {
      return `<@&${value}>`;
    }
    if (isUserIdArraySetting(key)) {
      return (value as string[]).map((v) => `<@!${v}>`).join(", ");
    }
    if (isChannelIdArraySetting(key)) {
      return (value as string[]).map((v) => `<#${v}>`).join(", ");
    }
    if (isRoleIdArraySetting(key)) {
      return (value as string[]).map((v) => `<@&${v}>`).join(", ");
    }
    if (isTriggerArraySetting(key)) {
      return (value as Trigger[])
        .map((v) => `${v.trigger} -> ${v.response}`)
        .join(", ");
    }
    if (isLevelRoleArraySetting(key)) {
      return (value as servers["level_roles"])
        .map((el) => `${el.level} -> <@&${el.role}>`)
        .join(", ");
    }

    return "Something went horribly wrong. Please contact Naomi.";
  } catch (err) {
    void beccaErrorHandler(Becca, "render setting module", err);
    return "Something went wrong with rendering this setting.";
  }
};
