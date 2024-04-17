import { assert } from "chai";

import { handleResetLevels } from "../../src/commands/subcommands/manage/handleResetLevels";
import { handleResetStars } from "../../src/commands/subcommands/manage/handleResetStars";
import { handleSuggestion } from "../../src/commands/subcommands/manage/handleSuggestion";
import { handleXpModify } from "../../src/commands/subcommands/manage/handleXpModify";

suite("handleResetLevels", () => {
  test("is defined", () => {
    assert.isDefined(handleResetLevels, "handleResetLevels is not defined");
    assert.isFunction(handleResetLevels, "handleResetLevels is not a function");
  });
});

suite("handleResetStars", () => {
  test("is defined", () => {
    assert.isDefined(handleResetStars, "handleResetStars is not defined");
    assert.isFunction(handleResetStars, "handleResetStars is not a function");
  });
});

suite("handleSuggestion", () => {
  test("is defined", () => {
    assert.isDefined(handleSuggestion, "handleSuggestion is not defined");
    assert.isFunction(handleSuggestion, "handleSuggestion is not a function");
  });
});

suite("handleXpModify", () => {
  test("is defined", () => {
    assert.isDefined(handleXpModify, "handleXpModify is not defined");
    assert.isFunction(handleXpModify, "handleXpModify is not a function");
  });
});
