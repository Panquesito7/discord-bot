import { assert } from "chai";

import { BeccaLyria } from "../../src/interfaces/BeccaLyria";
import { Context } from "../../src/interfaces/contexts/Context";
import { loadContexts } from "../../src/utils/loadContexts";
import { ContextNames } from "../__fixtures__/statics";

suite("loadContexts", () => {
  test("is defined", () => {
    assert.isDefined(loadContexts, "loadContexts is not defined");
    assert.isFunction(loadContexts, "loadContexts is not a function");
  });

  test("returns array of commands", async () => {
    const result: { contexts: Context[] | undefined } = { contexts: undefined };
    const success = await loadContexts(result as unknown as BeccaLyria);
    assert.isTrue(success, "loadContexts did not succeed");
    assert.isArray(result.contexts, "loadContexts did not return an array");
  });

  test("returns the expected command list", async () => {
    const result: { contexts: Context[] | undefined } = { contexts: undefined };
    await loadContexts(result as unknown as BeccaLyria);
    assert.equal(
      result.contexts?.length,
      3,
      "does not return the expected number of contexts"
    );
    const names = result.contexts?.map((el) => el.data.name);
    assert.deepEqual(names, ContextNames, "does not return the expected list");
  });
});
