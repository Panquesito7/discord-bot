import { assert } from "chai";

import { handleLogs } from "../../src/commands/subcommands/support/handleLogs";
import { handleServer } from "../../src/commands/subcommands/support/handleServer";

suite("handleServer", () => {
  test("is defined", () => {
    assert.isDefined(handleServer, "handleServer is not defined");
    assert.isFunction(handleServer, "handleServer is not a function");
  });
});

suite("handleLogs", () => {
  test("is defined", () => {
    assert.isDefined(handleLogs, "handleLogs is not defined");
    assert.isFunction(handleLogs, "handleLogs is not a function");
  });
});
