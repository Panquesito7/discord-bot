import { assert } from "chai";

import { runNaomiCommands } from "../../src/modules/events/runNaomiCommands";

suite("runNaomiCommands", () => {
  test("is defined", () => {
    assert.isDefined(runNaomiCommands, "runNaomiCommands is not defined");
    assert.isFunction(runNaomiCommands, "runNaomiCommands is not a function");
  });
});
