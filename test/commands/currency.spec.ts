import { assert } from "chai";

import { currency } from "../../src/commands/currency";

suite("currency command", () => {
  test("is defined", () => {
    assert.isDefined(currency, "currency is not defined");
    assert.isDefined(currency.data, "data property is missing");
    assert.isObject(currency.data, "data property is not an object");
    assert.isDefined(currency.run, "run property is missing");
    assert.isFunction(currency.run, "run property is not a function");
  });
});
