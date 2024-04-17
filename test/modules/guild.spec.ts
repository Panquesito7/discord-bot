import { assert } from "chai";

import { memberRemoveCleanup } from "../../src/modules/guild/memberRemoveCleanup";
import { sendLogEmbed } from "../../src/modules/guild/sendLogEmbed";
import { sendWelcomeEmbed } from "../../src/modules/guild/sendWelcomeEmbed";

suite("memberRemoveCleanup", () => {
  test("is defined", () => {
    assert.isDefined(memberRemoveCleanup, "memberRemoveCleanup is not defined");
    assert.isFunction(
      memberRemoveCleanup,
      "memberRemoveCleanup is not a function"
    );
  });
});

suite("sendLogEmbed", () => {
  test("is defined", () => {
    assert.isDefined(sendLogEmbed, "sendLogEmbed is not defined");
    assert.isFunction(sendLogEmbed, "sendLogEmbed is not a function");
  });
});

suite("sendWelcomeEmbed", () => {
  test("is defined", () => {
    assert.isDefined(sendWelcomeEmbed, "sendWelcomeEmbed is not defined");
    assert.isFunction(sendWelcomeEmbed, "sendWelcomeEmbed is not a function");
  });
});
