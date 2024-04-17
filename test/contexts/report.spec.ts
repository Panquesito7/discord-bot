import { assert } from "chai";

import { report } from "../../src/contexts/report";

suite("report", () => {
  test("is defined", () => {
    assert.isDefined(report, "report is not defined");
    assert.isDefined(report.data, "data property is missing");
    assert.isObject(report.data, "data property is not an object");
    assert.isDefined(report.run, "run property is missing");
    assert.isFunction(report.run, "run property is not a function");
  });
});
