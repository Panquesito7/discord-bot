import { assert } from "chai";

import { naomiAntiphish } from "../../src/modules/naomi/naomiAntiphish";
import { naomiMee6 } from "../../src/modules/naomi/naomiMee6";
import { naomiPurgeData } from "../../src/modules/naomi/naomiPurgeData";
import { naomiTopgg } from "../../src/modules/naomi/naomiTopgg";
import { naomiUnregisterCommand } from "../../src/modules/naomi/naomiUnregisterCommand";
import { naomiViewCommands } from "../../src/modules/naomi/naomiViewCommands";

suite("naomiAntiphish", () => {
  test("is defined", () => {
    assert.isDefined(naomiAntiphish, "naomiAntiphish is not defined");
    assert.isFunction(naomiAntiphish, "naomiAntiphish is not a function");
  });
});

suite("naomiMee6", () => {
  test("is defined", () => {
    assert.isDefined(naomiMee6, "naomiMee6 is not defined");
    assert.isFunction(naomiMee6, "naomiMee6 is not a function");
  });
});

suite("naomiPurgeData", () => {
  test("is defined", () => {
    assert.isDefined(naomiPurgeData, "naomiPurgeData is not defined");
    assert.isFunction(naomiPurgeData, "naomiPurgeData is not a function");
  });
});

suite("naomiTopgg", () => {
  test("is defined", () => {
    assert.isDefined(naomiTopgg, "naomiTopgg is not defined");
    assert.isFunction(naomiTopgg, "naomiTopgg is not a function");
  });
});

suite("naomiUnregisterCommand", () => {
  test("is defined", () => {
    assert.isDefined(
      naomiUnregisterCommand,
      "naomiUnregisterCommand is not defined"
    );
    assert.isFunction(
      naomiUnregisterCommand,
      "naomiUnregisterCommand is not a function"
    );
  });
});

suite("naomiViewCommands", () => {
  test("is defined", () => {
    assert.isDefined(naomiViewCommands, "naomiViewCommands is not defined");
    assert.isFunction(naomiViewCommands, "naomiViewCommands is not a function");
  });
});
