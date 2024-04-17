import { assert } from "chai";

import { emoteListener } from "../../src/listeners/emoteListener";

suite("emoteListener", () => {
  test("is defined", () => {
    assert.isDefined(emoteListener, "emoteListener is not defined");
    assert.isDefined(emoteListener.name, "emoteListener.name is not defined");
    assert.isString(emoteListener.name, "emoteListener.name is not a string");
    assert.isDefined(
      emoteListener.description,
      "emoteListener.description is not defined"
    );
    assert.isString(
      emoteListener.description,
      "emoteListener.description is not a string"
    );
    assert.isDefined(emoteListener.run, "emoteListener.run is not defined");
    assert.isFunction(emoteListener.run, "emoteListener.run is not a function");
  });
});
