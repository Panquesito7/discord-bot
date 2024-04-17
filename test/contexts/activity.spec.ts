import { assert } from "chai";

import { activity } from "../../src/contexts/activity";

suite("activity", () => {
  test("is defined", () => {
    assert.isDefined(activity, "activity is not defined");
    assert.isDefined(activity.data, "data property is missing");
    assert.isObject(activity.data, "data property is not an object");
    assert.isDefined(activity.run, "run property is missing");
    assert.isFunction(activity.run, "run property is not a function");
  });
});
