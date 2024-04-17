import { assert } from "chai";

import { handleTriggerAdd } from "../../src/commands/subcommands/triggers/handleTriggerAdd";
import { handleTriggerRemove } from "../../src/commands/subcommands/triggers/handleTriggerRemove";
import { handleTriggerView } from "../../src/commands/subcommands/triggers/handleTriggerView";

suite("handleTriggerAdd", () => {
  test("is defined", () => {
    assert.isDefined(handleTriggerAdd, "handleTriggerAdd is not defined");
    assert.isFunction(handleTriggerAdd, "handleTriggerAdd is not a function");
  });
});

suite("handleTriggerRemove", () => {
  test("is defined", () => {
    assert.isDefined(handleTriggerRemove, "handleTriggerRemove is not defined");
    assert.isFunction(
      handleTriggerRemove,
      "handleTriggerRemove is not a function"
    );
  });
});

suite("handleTriggerView", () => {
  test("is defined", () => {
    assert.isDefined(handleTriggerView, "handleTriggerView is not defined");
    assert.isFunction(handleTriggerView, "handleTriggerView is not a function");
  });
});
