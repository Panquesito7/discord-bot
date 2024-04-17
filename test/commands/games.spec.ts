import { assert } from "chai";

import { games } from "../../src/commands/games";

suite("games command", () => {
  test("is defined", () => {
    assert.isDefined(games, "games is not defined");
    assert.isDefined(games.data, "data property is missing");
    assert.isObject(games.data, "data property is not an object");
    assert.isDefined(games.run, "run property is missing");
    assert.isFunction(games.run, "run property is not a function");
  });
});
