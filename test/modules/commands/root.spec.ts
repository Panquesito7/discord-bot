import { assert } from "chai";

import { errorEmbedGenerator } from "../../../src/modules/commands/errorEmbedGenerator";
import { logActivity } from "../../../src/modules/commands/logActivity";

suite("errorEmbedGenerator", () => {
  test("is defined", () => {
    assert.isDefined(errorEmbedGenerator, "errorEmbedGenerator is not defined");
    assert.isFunction(
      errorEmbedGenerator,
      "errorEmbedGenerator is not a function"
    );
  });
});

suite("logActivity", () => {
  test("is defined", () => {
    assert.isDefined(logActivity, "logActivity is not defined");
    assert.isFunction(logActivity, "logActivity is not a function");
  });
});
