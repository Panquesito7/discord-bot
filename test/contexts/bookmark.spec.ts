import { assert } from "chai";

import { bookmark } from "../../src/contexts/bookmark";

suite("bookmark", () => {
  test("is defined", () => {
    assert.isDefined(bookmark, "bookmark is not defined");
    assert.isDefined(bookmark.data, "data property is missing");
    assert.isObject(bookmark.data, "data property is not an object");
    assert.isDefined(bookmark.run, "run property is missing");
    assert.isFunction(bookmark.run, "run property is not a function");
  });
});
