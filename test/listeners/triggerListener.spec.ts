import { assert } from "chai";

import { triggerListener } from "../../src/listeners/triggerListener";

suite("triggerListener", () => {
  test("is defined", () => {
    assert.isDefined(triggerListener, "triggerListener is not defined");
    assert.isDefined(
      triggerListener.name,
      "triggerListener.name is not defined"
    );
    assert.isString(
      triggerListener.name,
      "triggerListener.name is not a string"
    );
    assert.isDefined(
      triggerListener.description,
      "triggerListener.description is not defined"
    );
    assert.isString(
      triggerListener.description,
      "triggerListener.description is not a string"
    );
    assert.isDefined(triggerListener.run, "triggerListener.run is not defined");
    assert.isFunction(
      triggerListener.run,
      "triggerListener.run is not a function"
    );
  });
});
