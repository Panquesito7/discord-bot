import { assert } from "chai";

import { handleCanIUse } from "../../src/commands/subcommands/code/handleCanIUse";
import { handleColour } from "../../src/commands/subcommands/code/handleColour";
import { handleHttp } from "../../src/commands/subcommands/code/handleHttp";

suite("handleCanIUse", () => {
  test("is defined", () => {
    assert.isDefined(handleCanIUse, "handleCanIUse is not defined");
    assert.isFunction(handleCanIUse, "handleCanIUse is not a function");
  });
});

suite("handleColour", () => {
  test("is defined", () => {
    assert.isDefined(handleColour, "handleColour is not defined");
    assert.isFunction(handleColour, "handleColour is not a function");
  });
});

suite("handleHttp", () => {
  test("is defined", () => {
    assert.isDefined(handleHttp, "handleHttp is not defined");
    assert.isFunction(handleHttp, "handleHttp is not a function");
  });
});
