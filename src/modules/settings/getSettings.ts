import { servers } from "@prisma/client";

import { defaultServer } from "../../config/database/defaultServer";
import { BeccaLyria } from "../../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../../utils/beccaErrorHandler";

/**
 * This utility fetches the server settings for the given ID from the
 * database. If the server does not have a record, it creates one with the
 * default values.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {string} serverID Discord ID of the server to get the settings for.
 * @param {string} serverName Name of the server.
 * @returns {servers | null} The server settings object, or null on error.
 */
export const getSettings = async (
  Becca: BeccaLyria,
  serverID: string,
  serverName: string
): Promise<servers | null> => {
  try {
    return Becca.db.servers.upsert({
      where: {
        serverID,
      },
      update: {},
      create: {
        serverID,
        serverName,
        ...defaultServer,
      },
    });
  } catch (err) {
    await beccaErrorHandler(Becca, "get settings module", err, serverName);
    return null;
  }
};
