import { assert } from "chai";

import { BeccaLyria } from "../../src/interfaces/BeccaLyria";
import { Command } from "../../src/interfaces/commands/Command";
import { loadCommands } from "../../src/utils/loadCommands";
import { CommandNames } from "../__fixtures__/statics";

suite("loadCommands", () => {
  test("is defined", () => {
    assert.isDefined(loadCommands, "loadCommands is not defined");
    assert.isFunction(loadCommands, "loadCommands is not a function");
  });

  test("returns array of commands", async () => {
    const result: { commands: Command[] | undefined } = { commands: undefined };
    const success = await loadCommands(result as unknown as BeccaLyria);
    assert.isTrue(success, "loadCommands did not succeed");
    assert.isArray(result.commands, "loadCommands did not return an array");
  });

  test("returns the expected command list", async () => {
    const result: { commands: Command[] | undefined } = { commands: undefined };
    await loadCommands(result as unknown as BeccaLyria);
    assert.equal(
      result.commands?.length,
      CommandNames.length,
      "does not return the expected number of commands"
    );
    const names = result.commands?.map((el) => el.data.name);
    assert.deepEqual(names, CommandNames, "does not return the expected list");
  });
});
