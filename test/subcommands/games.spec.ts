import { assert } from "chai";

import { handleFact } from "../../src/commands/subcommands/games/handleFact";
import { handleMtg } from "../../src/commands/subcommands/games/handleMtg";
import { handleSlime } from "../../src/commands/subcommands/games/handleSlime";
import { handleSus } from "../../src/commands/subcommands/games/handleSus";
import { handleTrivia } from "../../src/commands/subcommands/games/handleTrivia";

suite("handleFact", () => {
  test("is defined", () => {
    assert.isDefined(handleFact, "handleFact is not defined");
    assert.isFunction(handleFact, "handleFact is not a function");
  });
});

suite("handleMtg", () => {
  test("is defined", () => {
    assert.isDefined(handleMtg, "handleMtg is not defined");
    assert.isFunction(handleMtg, "handleMtg is not a function");
  });
});

suite("handleSlime", () => {
  test("is defined", () => {
    assert.isDefined(handleSlime, "handleSlime is not defined");
    assert.isFunction(handleSlime, "handleSlime is not a function");
  });
});

suite("handleSus", () => {
  test("is defined", () => {
    assert.isDefined(handleSus, "handleSus is not defined");
    assert.isFunction(handleSus, "handleSus is not a function");
  });
});

suite("handleTrivia", () => {
  test("is defined", () => {
    assert.isDefined(handleTrivia, "handleTrivia is not defined");
    assert.isFunction(handleTrivia, "handleTrivia is not a function");
  });
});
