import { assert } from "chai";

import { beccaErrorHandler } from "../../src/utils/beccaErrorHandler";

suite("beccaErrorHandler", () => {
  test("is defined", () => {
    assert.isDefined(beccaErrorHandler, "beccaErrorHandler is not defined");
    assert.isFunction(beccaErrorHandler, "beccaErrorHandler is not a function");
  });
});
