import { assert } from "chai";

import { code } from "../../src/commands/code";

suite("code command", () => {
  test("is defined", () => {
    assert.isDefined(code, "code is not defined");
    assert.isDefined(code.data, "data property is missing");
    assert.isObject(code.data, "data property is not an object");
    assert.isDefined(code.run, "run property is missing");
    assert.isFunction(code.run, "run property is not a function");
  });
});
