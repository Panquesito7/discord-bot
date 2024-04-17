import { assert } from "chai";

import { handleLevelCard } from "../../src/commands/subcommands/userconfig/handleLevelCard";
import { handleUserConfigView } from "../../src/commands/subcommands/userconfig/handleUserConfigView";

suite("handleLevelCard", () => {
  test("is defined", () => {
    assert.isDefined(handleLevelCard, "handleLevelCard is not defined");
    assert.isFunction(handleLevelCard, "handleLevelCard is not a function");
  });
});

suite("handleUserConfigView", () => {
  test("is defined", () => {
    assert.isDefined(
      handleUserConfigView,
      "handleUserConfigView is not defined"
    );
    assert.isFunction(
      handleUserConfigView,
      "handleUserConfigView is not a function"
    );
  });
});
