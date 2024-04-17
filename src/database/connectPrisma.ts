import { PrismaClient } from "@prisma/client";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";

/**
 * Connects Prisma and mounts it to Becca's instance.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {boolean} Whether the connection was successful or not.
 */
export const connectPrisma = async (Becca: BeccaLyria) => {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    Becca.db = prisma;
    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "connect prisma", err);
    return false;
  }
};
