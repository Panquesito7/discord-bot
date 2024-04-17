import { assert } from "chai";

import { config } from "../../src/commands/config";

suite("config command", () => {
  test("is defined", () => {
    assert.isDefined(config, "config is not defined");
    assert.isDefined(config.data, "data property is missing");
    assert.isObject(config.data, "data property is not an object");
    assert.isDefined(config.run, "run property is missing");
    assert.isFunction(config.run, "run property is not a function");
  });
});
