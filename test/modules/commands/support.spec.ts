import { assert } from "chai";

import { isSupportStaff } from "../../../src/modules/commands/support/isSupportStaff";

suite("isSupportStaff", () => {
  test("is defined", () => {
    assert.isDefined(isSupportStaff, "isSupportStaff is not defined");
    assert.isFunction(isSupportStaff, "isSupportStaff is not a function");
  });
});
