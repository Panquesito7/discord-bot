import { assert } from "chai";

import { handleLanguage } from "../../src/commands/subcommands/misc/handleLanguage";
import { handleLevelscale } from "../../src/commands/subcommands/misc/handleLevelscale";
import { handlePermissions } from "../../src/commands/subcommands/misc/handlePermissions";
import { handleSpace } from "../../src/commands/subcommands/misc/handleSpace";
import { handleUsername } from "../../src/commands/subcommands/misc/handleUsername";
import { handleXkcd } from "../../src/commands/subcommands/misc/handleXkcd";

suite("handleLanguage", () => {
  test("is defined", () => {
    assert.isDefined(handleLanguage, "handleLanguage is not defined");
    assert.isFunction(handleLanguage, "handleLanguage is not a function");
  });
});

suite("handleLevelscale", () => {
  test("is defined", () => {
    assert.isDefined(handleLevelscale, "handleLevelscale is not defined");
    assert.isFunction(handleLevelscale, "handleLevelscale is not a function");
  });
});

suite("handlePermissions", () => {
  test("is defined", () => {
    assert.isDefined(handlePermissions, "handlePermissions is not defined");
    assert.isFunction(handlePermissions, "handlePermissions is not a function");
  });
});

suite("handleSpace", () => {
  test("is defined", () => {
    assert.isDefined(handleSpace, "handleSpace is not defined");
    assert.isFunction(handleSpace, "handleSpace is not a function");
  });
});

suite("handleUsername", () => {
  test("is defined", () => {
    assert.isDefined(handleUsername, "handleUsername is not defined");
    assert.isFunction(handleUsername, "handleUsername is not a function");
  });
});

suite("handleXkcd", () => {
  test("is defined", () => {
    assert.isDefined(handleXkcd, "handleXkcd is not defined");
    assert.isFunction(handleXkcd, "handleXkcd is not a function");
  });
});
