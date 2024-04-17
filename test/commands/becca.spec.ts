import { assert } from "chai";

import { becca } from "../../src/commands/becca";

suite("becca command", () => {
  test("is defined", () => {
    assert.isDefined(becca, "becca is not defined");
    assert.isDefined(becca.data, "data property is missing");
    assert.isObject(becca.data, "data property is not an object");
    assert.isDefined(becca.run, "run property is missing");
    assert.isFunction(becca.run, "run property is not a function");
  });
});
