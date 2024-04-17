import { assert } from "chai";

import { sassAmirite } from "../../src/modules/listeners/sass/sassAmirite";
import { sassGreeting } from "../../src/modules/listeners/sass/sassGreeting";
import { sassSorry } from "../../src/modules/listeners/sass/sassSorry";
import { sassThanks } from "../../src/modules/listeners/sass/sassThanks";

suite("sassAmirite", () => {
  test("is defined", () => {
    assert.isDefined(sassAmirite, "sassAmirite is not defined");
    assert.isFunction(sassAmirite, "sassAmirite is not a function");
  });
});

suite("sassGreeting", () => {
  test("is defined", () => {
    assert.isDefined(sassGreeting, "sassGreeting is not defined");
    assert.isFunction(sassGreeting, "sassGreeting is not a function");
  });
});

suite("sassSorry", () => {
  test("is defined", () => {
    assert.isDefined(sassSorry, "sassSorry is not defined");
    assert.isFunction(sassSorry, "sassSorry is not a function");
  });
});

suite("sassThanks", () => {
  test("is defined", () => {
    assert.isDefined(sassThanks, "sassThanks is not defined");
    assert.isFunction(sassThanks, "sassThanks is not a function");
  });
});
