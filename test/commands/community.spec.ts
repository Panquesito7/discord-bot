import { assert } from "chai";

import { community } from "../../src/commands/community";

suite("community command", () => {
  test("is defined", () => {
    assert.isDefined(community, "community is not defined");
    assert.isDefined(community.data, "data property is missing");
    assert.isObject(community.data, "data property is not an object");
    assert.isDefined(community.run, "run property is missing");
    assert.isFunction(community.run, "run property is not a function");
  });
});
