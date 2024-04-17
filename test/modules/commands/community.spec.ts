import { assert } from "chai";

import { generateLevelHtml } from "../../../src/modules/commands/community/generateLevelHtml";
import { generateLevelImage } from "../../../src/modules/commands/community/generateLevelImage";

suite("generateLevelHtml", () => {
  test("is defined", () => {
    assert.isDefined(generateLevelHtml, "generateLevelHtml is not defined");
    assert.isFunction(generateLevelHtml, "generateLevelHtml is not a function");
  });
});

suite("generateLevelImage", () => {
  test("is defined", () => {
    assert.isDefined(generateLevelImage, "generateLevelImage is not defined");
    assert.isFunction(
      generateLevelImage,
      "generateLevelImage is not a function"
    );
  });
});
