import { servers } from "@prisma/client";
import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ValidatedMessage } from "../discord/ValidatedMessage";

export type ListenerHandler = (
  Becca: BeccaLyria,
  message: ValidatedMessage,
  t: TFunction,
  config: servers
) => Promise<void | boolean>;
