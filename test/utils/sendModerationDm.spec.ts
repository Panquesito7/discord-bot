import { assert } from "chai";

import { sendModerationDm } from "../../src/utils/sendModerationDm";

suite("sendModerationDm", () => {
  test("is defined", () => {
    assert.isDefined(sendModerationDm, "sendModerationDm is not defined");
    assert.isFunction(sendModerationDm, "sendModerationDm is not a function");
  });
});
