import { assert } from "chai";

import { handleBan } from "../../src/commands/subcommands/moderation/handleBan";
import { handleHistory } from "../../src/commands/subcommands/moderation/handleHistory";
import { handleKick } from "../../src/commands/subcommands/moderation/handleKick";
import { handleMute } from "../../src/commands/subcommands/moderation/handleMute";
import { handleUnmute } from "../../src/commands/subcommands/moderation/handleUnmute";
import { handleWarn } from "../../src/commands/subcommands/moderation/handleWarn";

suite("handleBan", () => {
  test("is defined", () => {
    assert.isDefined(handleBan, "handleBan is not defined");
    assert.isFunction(handleBan, "handleBan is not a function");
  });
});

suite("handleHistory", () => {
  test("is defined", () => {
    assert.isDefined(handleHistory, "handleHistory is not defined");
    assert.isFunction(handleHistory, "handleHistory is not a function");
  });
});

suite("handleKick", () => {
  test("is defined", () => {
    assert.isDefined(handleKick, "handleKick is not defined");
    assert.isFunction(handleKick, "handleKick is not a function");
  });
});

suite("handleMute", () => {
  test("is defined", () => {
    assert.isDefined(handleMute, "handleMute is not defined");
    assert.isFunction(handleMute, "handleMute is not a function");
  });
});

suite("handleUnmute", () => {
  test("is defined", () => {
    assert.isDefined(handleUnmute, "handleUnmute is not defined");
    assert.isFunction(handleUnmute, "handleUnmute is not a function");
  });
});

suite("handleWarn", () => {
  test("is defined", () => {
    assert.isDefined(handleWarn, "handleWarn is not defined");
    assert.isFunction(handleWarn, "handleWarn is not a function");
  });
});
