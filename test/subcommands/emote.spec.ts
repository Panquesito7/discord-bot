import { assert } from "chai";

import { handleEmoteUse } from "../../src/commands/subcommands/emote/handleEmoteUse";
import { handleEmoteView } from "../../src/commands/subcommands/emote/handleEmoteView";

suite("handleEmoteUse", () => {
  test("is defined", () => {
    assert.isDefined(handleEmoteUse, "handleEmoteUse is not defined");
    assert.isFunction(handleEmoteUse, "handleEmoteUse is not a function");
  });
});

suite("handleEmoteView", () => {
  test("is defined", () => {
    assert.isDefined(handleEmoteView, "handleEmoteView is not defined");
    assert.isFunction(handleEmoteView, "handleEmoteView is not a function");
  });
});
