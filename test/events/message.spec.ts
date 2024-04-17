import { assert } from "chai";

import { messageCreate } from "../../src/events/messageEvents/messageCreate";
import { messageDelete } from "../../src/events/messageEvents/messageDelete";
import { messageUpdate } from "../../src/events/messageEvents/messageUpdate";

suite("messageCreate", () => {
  test("is defined", () => {
    assert.isDefined(messageCreate, "messageCreate is not defined");
    assert.isFunction(messageCreate, "messageCreate is not a function");
  });
});

suite("messageDelete", () => {
  test("is defined", () => {
    assert.isDefined(messageDelete, "messageDelete is not defined");
    assert.isFunction(messageDelete, "messageDelete is not a function");
  });
});

suite("messageUpdate", () => {
  test("is defined", () => {
    assert.isDefined(messageUpdate, "messageUpdate is not defined");
    assert.isFunction(messageUpdate, "messageUpdate is not a function");
  });
});
