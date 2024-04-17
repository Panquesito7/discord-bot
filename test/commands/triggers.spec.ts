import { assert } from "chai";

import { triggers } from "../../src/commands/triggers";

suite("triggers command", () => {
  test("is defined", () => {
    assert.isDefined(triggers, "triggers is not defined");
    assert.isDefined(triggers.data, "data property is missing");
    assert.isObject(triggers.data, "data property is not an object");
    assert.isDefined(triggers.run, "run property is missing");
    assert.isFunction(triggers.run, "run property is not a function");
  });
});
