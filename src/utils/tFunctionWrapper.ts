import { DefaultTFuncReturn, TFunction } from "i18next";

import { getRandomValue } from "./getRandomValue";

/**
 * Module to wrap tFunction calls for random array values.
 * This saves us from repeating the type everywhere.
 *
 * @param {TFunction} t Translation function.
 * @param {string} key The key to translate.
 * @returns {string} The translated string.
 */
export const tFunctionArrayWrapper = (t: TFunction, key: string): string =>
  getRandomValue(t<string, DefaultTFuncReturn & string[]>(key));
