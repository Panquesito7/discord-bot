import { assert } from "chai";

import { handleAdd } from "../../src/commands/subcommands/reactionrole/handleAdd";
import { handleCreate } from "../../src/commands/subcommands/reactionrole/handleCreate";
import { handleRemove } from "../../src/commands/subcommands/reactionrole/handleRemove";

suite("handleAdd", () => {
  test("is defined", () => {
    assert.isDefined(handleAdd, "handleAdd is not defined");
    assert.isFunction(handleAdd, "handleAdd is not a function");
  });
});

suite("handleCreate", () => {
  test("is defined", () => {
    assert.isDefined(handleCreate, "handleCreate is not defined");
    assert.isFunction(handleCreate, "handleCreate is not a function");
  });
});

suite("handleRemove", () => {
  test("is defined", () => {
    assert.isDefined(handleRemove, "handleRemove is not defined");
    assert.isFunction(handleRemove, "handleRemove is not a function");
  });
});
