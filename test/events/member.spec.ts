import { assert } from "chai";

import { memberAdd } from "../../src/events/memberEvents/memberAdd";
import { memberRemove } from "../../src/events/memberEvents/memberRemove";
import { memberUpdate } from "../../src/events/memberEvents/memberUpdate";

suite("memberAdd", () => {
  test("is defined", () => {
    assert.isDefined(memberAdd, "memberAdd is not defined");
    assert.isFunction(memberAdd, "memberAdd is not a function");
  });
});

suite("memberRemove", () => {
  test("is defined", () => {
    assert.isDefined(memberRemove, "memberRemove is not defined");
    assert.isFunction(memberRemove, "memberRemove is not a function");
  });
});

suite("memberUpdate", () => {
  test("is defined", () => {
    assert.isDefined(memberUpdate, "memberUpdate is not defined");
    assert.isFunction(memberUpdate, "memberUpdate is not a function");
  });
});
