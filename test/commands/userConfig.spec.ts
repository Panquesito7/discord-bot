import { assert } from "chai";

import { userConfig } from "../../src/commands/userConfig";

suite("userConfig command", () => {
  test("is defined", () => {
    assert.isDefined(userConfig, "userConfig is not defined");
    assert.isDefined(userConfig.data, "data property is missing");
    assert.isObject(userConfig.data, "data property is not an object");
    assert.isDefined(userConfig.run, "run property is missing");
    assert.isFunction(userConfig.run, "run property is not a function");
  });
});
