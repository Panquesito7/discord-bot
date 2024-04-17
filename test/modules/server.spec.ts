import { assert } from "chai";

import { sendVoteMessage } from "../../src/modules/server/sendVoteMessage";
import { sendVoteReminder } from "../../src/modules/server/sendVoteReminder";
import { sendVoteReward } from "../../src/modules/server/sendVoteReward";

suite("sendVoteMessage", () => {
  test("is defined", () => {
    assert.isDefined(sendVoteMessage, "sendVoteMessage is not defined");
    assert.isFunction(sendVoteMessage, "sendVoteMessage is not a function");
  });
});

suite("sendVoteReminder", () => {
  test("is defined", () => {
    assert.isDefined(sendVoteReminder, "sendVoteReminder is not defined");
    assert.isFunction(sendVoteReminder, "sendVoteReminder is not a function");
  });
});

suite("sendVoteReward", () => {
  test("is defined", () => {
    assert.isDefined(sendVoteReward, "sendVoteReward is not defined");
    assert.isFunction(sendVoteReward, "sendVoteReward is not a function");
  });
});
