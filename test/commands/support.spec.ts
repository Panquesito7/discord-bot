import { assert } from "chai";

import { support } from "../../src/commands/support";

suite("support command", () => {
  test("is defined", () => {
    assert.isDefined(support, "support is not defined");
    assert.isDefined(support.data, "data property is missing");
    assert.isObject(support.data, "data property is not an object");
    assert.isDefined(support.run, "run property is missing");
    assert.isFunction(support.run, "run property is not a function");
  });
});
