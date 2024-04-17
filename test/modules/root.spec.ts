import { assert } from "chai";

import { validateEnv } from "../../src/modules/validateEnv";

suite("validateEnv", () => {
  test("is defined", () => {
    assert.isDefined(validateEnv, "validateEnv is not defined");
    assert.isFunction(validateEnv, "validateEnv is not a function");
  });
});
