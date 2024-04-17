import { TFunction } from "i18next";

import { BeccaLyria } from "../BeccaLyria";
import { ValidatedButtonInteraction } from "../discord/ValidatedButtonInteraction";

/**
 * Handles a button click.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {ValidatedButtonInteraction} interaction The interaction payload from Discord.
 * @param {TFunction} t Translation function.
 */
export type ButtonHandler = (
  Becca: BeccaLyria,
  interaction: ValidatedButtonInteraction,
  t: TFunction
) => Promise<void>;
