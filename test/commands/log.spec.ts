import { assert } from "chai";

import { log } from "../../src/commands/log";

suite("log command", () => {
  test("is defined", () => {
    assert.isDefined(log, "log is not defined");
    assert.isDefined(log.data, "data property is missing");
    assert.isObject(log.data, "data property is not an object");
    assert.isDefined(log.run, "run property is missing");
    assert.isFunction(log.run, "run property is not a function");
  });
});
