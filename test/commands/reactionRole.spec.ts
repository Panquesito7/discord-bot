import { assert } from "chai";

import { reactionRole } from "../../src/commands/reactionRole";

suite("reactionRole command", () => {
  test("is defined", () => {
    assert.isDefined(reactionRole, "reactionRole is not defined");
    assert.isDefined(reactionRole.data, "data property is missing");
    assert.isObject(reactionRole.data, "data property is not an object");
    assert.isDefined(reactionRole.run, "run property is missing");
    assert.isFunction(reactionRole.run, "run property is not a function");
  });
});
