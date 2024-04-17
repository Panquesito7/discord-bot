import { assert } from "chai";

import { initialiseTranslations } from "../../src/config/i18n/initialiseTranslations";

suite("initialiseTranslations", () => {
  test("is defined", () => {
    assert.isDefined(
      initialiseTranslations,
      "initialiseTranslations is not defined"
    );
    assert.isFunction(
      initialiseTranslations,
      "initialiseTranslations is not a function"
    );
  });
});
