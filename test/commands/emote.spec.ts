import { assert } from "chai";

import { emote } from "../../src/commands/emote";

suite("emote command", () => {
  test("is defined", () => {
    assert.isDefined(emote, "emote is not defined");
    assert.isDefined(emote.data, "data property is missing");
    assert.isObject(emote.data, "data property is not an object");
    assert.isDefined(emote.run, "run property is missing");
    assert.isFunction(emote.run, "run property is not a function");
  });
});
