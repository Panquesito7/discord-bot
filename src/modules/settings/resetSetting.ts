import { servers } from "@prisma/client";

import { defaultServer } from "../../config/database/defaultServer";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { Settings } from "../../interfaces/settings/Settings";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * This will reset the given setting to the default value.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} serverID Discord ID of the server to modify settings for.
 * @param {string} serverName Name of that server.
 * @param {Settings} key The name of the setting to modify.
 * @returns {servers | null} The server setting object, or null on error.
 */
export const resetSetting = async (
  Becca: BeccaLyria,
  serverID: string,
  serverName: string,
  key: Settings
): Promise<servers | null> => {
  try {
    const newServer = await Becca.db.servers.update({
      where: {
        serverID,
      },
      data: {
        [key]: defaultServer[key],
      },
    });
    return newServer;
  } catch (err) {
    await beccaErrorHandler(Becca, "reset setting module", err, serverName);
    return null;
  }
};
