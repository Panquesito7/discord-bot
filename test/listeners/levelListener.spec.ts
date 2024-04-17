import { assert } from "chai";

import { levelListener } from "../../src/listeners/levelListener";

suite("levelListener", () => {
  test("is defined", () => {
    assert.isDefined(levelListener, "levelListener is not defined");
    assert.isDefined(levelListener.name, "levelListener.name is not defined");
    assert.isString(levelListener.name, "levelListener.name is not a string");
    assert.isDefined(
      levelListener.description,
      "levelListener.description is not defined"
    );
    assert.isString(
      levelListener.description,
      "levelListener.description is not a string"
    );
    assert.isDefined(levelListener.run, "levelListener.run is not defined");
    assert.isFunction(levelListener.run, "levelListener.run is not a function");
  });
});
