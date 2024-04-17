import { assert } from "chai";

import { optOut } from "../../src/commands/optOut";

suite("optOut command", () => {
  test("is defined", () => {
    assert.isDefined(optOut, "optOut is not defined");
    assert.isDefined(optOut.data, "data property is missing");
    assert.isObject(optOut.data, "data property is not an object");
    assert.isDefined(optOut.run, "run property is missing");
    assert.isFunction(optOut.run, "run property is not a function");
  });
});
