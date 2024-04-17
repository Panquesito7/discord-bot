import { assert } from "chai";

import { sassListener } from "../../src/listeners/sassListener";

suite("sassListener", () => {
  test("is defined", () => {
    assert.isDefined(sassListener, "sassListener is not defined");
    assert.isDefined(sassListener.name, "sassListener.name is not defined");
    assert.isString(sassListener.name, "sassListener.name is not a string");
    assert.isDefined(
      sassListener.description,
      "sassListener.description is not defined"
    );
    assert.isString(
      sassListener.description,
      "sassListener.description is not a string"
    );
    assert.isDefined(sassListener.run, "sassListener.run is not defined");
    assert.isFunction(sassListener.run, "sassListener.run is not a function");
  });
});
