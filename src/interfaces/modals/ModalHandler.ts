import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ValidatedModalSubmitInteraction } from "../discord/ValidatedModalSubmitInteraction";

/**
 * Handles the logic execution for a modal submission.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ValidatedModalSubmitInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export type ModalHandler = (
  Becca: BeccaLyria,
  interaction: ValidatedModalSubmitInteraction,
  t: TFunction
) => Promise<void>;
