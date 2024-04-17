import { assert } from "chai";

import { voiceStateUpdate } from "../../src/events/voiceEvents/voiceStateUpdate";

suite("voiceStateUpdate", () => {
  test("is defined", () => {
    assert.isDefined(voiceStateUpdate, "voiceStateUpdate is not defined");
    assert.isFunction(voiceStateUpdate, "voiceStateUpdate is not a function");
  });
});
