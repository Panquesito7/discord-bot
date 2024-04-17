import { assert } from "chai";

import { generateUsername } from "../../../src/modules/commands/general/generateUsername";

suite("generateUsername", () => {
  test("is defined", () => {
    assert.isDefined(generateUsername, "generateUsername is not defined");
    assert.isFunction(generateUsername, "generateUsername is not a function");
  });
});
