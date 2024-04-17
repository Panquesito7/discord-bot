import { assert } from "chai";

import levelScale from "../../src/config/listeners/levelScale";

suite("levelScale", () => {
  test("is defined", () => {
    assert.isDefined(levelScale, "levelScale is not defined");
    assert.isArray(levelScale, "levelScale is not an array");
  });
});
