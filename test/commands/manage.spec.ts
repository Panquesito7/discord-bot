import { assert } from "chai";

import { manage } from "../../src/commands/manage";

suite("manage command", () => {
  test("is defined", () => {
    assert.isDefined(manage, "manage is not defined");
    assert.isDefined(manage.data, "data property is missing");
    assert.isObject(manage.data, "data property is not an object");
    assert.isDefined(manage.run, "run property is missing");
    assert.isFunction(manage.run, "run property is not a function");
  });
});
