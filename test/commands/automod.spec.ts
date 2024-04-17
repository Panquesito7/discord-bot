import { assert } from "chai";

import { automod } from "../../src/commands/automod";

suite("automod command", () => {
  test("is defined", () => {
    assert.isDefined(automod, "automod is not defined");
    assert.isDefined(automod.data, "data property is missing");
    assert.isObject(automod.data, "data property is not an object");
    assert.isDefined(automod.run, "run property is missing");
    assert.isFunction(automod.run, "run property is not a function");
  });
});
