import { assert } from "chai";

import { handleInvalidSubcommand } from "../../src/commands/subcommands/handleInvalidSubcommand";

suite("handleInvalidSubcommand", () => {
  test("is defined", () => {
    assert.isDefined(
      handleInvalidSubcommand,
      "handleInvalidSubcommand is not defined"
    );
    assert.isFunction(
      handleInvalidSubcommand,
      "handleInvalidSubcommand is not a function"
    );
  });
});
