import { assert } from "chai";

import { getCounts } from "../../src/modules/becca/getCounts";

suite("get counts", () => {
  test("is defined", () => {
    assert.isDefined(getCounts, "getCounts is not defined");
    assert.isFunction(getCounts, "getCounts is not a function");
  });
});
