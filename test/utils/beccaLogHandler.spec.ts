import { assert } from "chai";

import { beccaLogHandler } from "../../src/utils/beccaLogHandler";

suite("beccaLogHandler", () => {
  test("is defined", () => {
    assert.isDefined(beccaLogHandler, "beccaLogHandler is not defined");
    assert.isObject(beccaLogHandler, "beccaLogHandler is not an object");
  });

  test("has log function", () => {
    assert.isDefined(beccaLogHandler.log, "log is not defined");
    assert.isFunction(beccaLogHandler.log, "log is not a function");
  });
});
