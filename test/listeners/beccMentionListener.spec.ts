import { assert } from "chai";

import { beccaMentionListener } from "../../src/listeners/beccaMentionListener";

suite("beccaMentionListener", () => {
  test("is defined", () => {
    assert.isDefined(
      beccaMentionListener,
      "beccaMentionListener is not defined"
    );
    assert.isDefined(
      beccaMentionListener.name,
      "beccaMentionListener.name is not defined"
    );
    assert.isString(
      beccaMentionListener.name,
      "beccaMentionListener.name is not a string"
    );
    assert.isDefined(
      beccaMentionListener.description,
      "beccaMentionListener.description is not defined"
    );
    assert.isString(
      beccaMentionListener.description,
      "beccaMentionListener.description is not a string"
    );
    assert.isDefined(
      beccaMentionListener.run,
      "beccaMentionListener.run is not defined"
    );
    assert.isFunction(
      beccaMentionListener.run,
      "beccaMentionListener.run is not a function"
    );
  });
});
