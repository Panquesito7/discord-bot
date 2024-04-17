import { assert } from "chai";

import { getSettings } from "../../src/modules/settings/getSettings";
import { renderSetting } from "../../src/modules/settings/renderSetting";
import { resetSetting } from "../../src/modules/settings/resetSetting";
import { setSetting } from "../../src/modules/settings/setSetting";

suite("getSettings", () => {
  test("is defined", () => {
    assert.isDefined(getSettings, "getSettings is not defined");
    assert.isFunction(getSettings, "getSettings is not a function");
  });
});

suite("renderSetting", () => {
  test("is defined", () => {
    assert.isDefined(renderSetting, "renderSetting is not defined");
    assert.isFunction(renderSetting, "renderSetting is not a function");
  });
});

suite("resetSetting", () => {
  test("is defined", () => {
    assert.isDefined(resetSetting, "resetSetting is not defined");
    assert.isFunction(resetSetting, "resetSetting is not a function");
  });
});

suite("setSetting", () => {
  test("is defined", () => {
    assert.isDefined(setSetting, "setSetting is not defined");
    assert.isFunction(setSetting, "setSetting is not a function");
  });
});
