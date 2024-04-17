import { assert } from "chai";

import { threadCreate } from "../../src/events/threadEvents/threadCreate";
import { threadDelete } from "../../src/events/threadEvents/threadDelete";
import { threadUpdate } from "../../src/events/threadEvents/threadUpdate";

suite("threadCreate", () => {
  test("is defined", () => {
    assert.isDefined(threadCreate, "threadCreate is not defined");
    assert.isFunction(threadCreate, "threadCreate is not a function");
  });
});

suite("threadDelete", () => {
  test("is defined", () => {
    assert.isDefined(threadDelete, "threadDelete is not defined");
    assert.isFunction(threadDelete, "threadDelete is not a function");
  });
});

suite("threadUpdate", () => {
  test("is defined", () => {
    assert.isDefined(threadUpdate, "threadUpdate is not defined");
    assert.isFunction(threadUpdate, "threadUpdate is not a function");
  });
});
