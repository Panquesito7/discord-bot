import { assert } from "chai";

import { adventureList } from "../../src/config/commands/adventureList";
import { artList } from "../../src/config/commands/artList";
import {
  emoteChoices,
  throwList,
  smackList,
} from "../../src/config/commands/emoteData";
import { httpStatus } from "../../src/config/commands/httpStatus";
import { motivationalQuotes } from "../../src/config/commands/motivationalQuotes";
import { optOutChoices } from "../../src/config/commands/optOutChoices";
import {
  accountVerificationMap,
  contentFilterMap,
} from "../../src/config/commands/serverInfo";
import { slimeList } from "../../src/config/commands/slimeList";
import { SusList } from "../../src/config/commands/susList";
import { topicList } from "../../src/config/commands/topicList";
import { translatorList } from "../../src/config/commands/translatorList";
import { updatesSinceLastRelease } from "../../src/config/commands/updatesData";

suite("adventureList", () => {
  test("is defined", () => {
    assert.isDefined(adventureList, "adventureList is not defined");
    assert.isArray(adventureList, "adventureList is not an array");
  });
});

suite("artList", () => {
  test("is defined", () => {
    assert.isDefined(artList, "artList is not defined");
    assert.isArray(artList, "artList is not an array");
  });
});

suite("emoteData", () => {
  test("is defined", () => {
    assert.isDefined(emoteChoices, "emoteChoices is not defined");
    assert.isArray(emoteChoices, "emoteChoices is not an array");
    assert.isDefined(throwList, "throwList is not defined");
    assert.isArray(throwList, "throwList is not an array");
    assert.isDefined(smackList, "smackList is not defined");
    assert.isArray(smackList, "smackList is not an array");
  });

  // TODO: Figure out how to extract keys from emotecounts type/schema.
  // suite("Emote Choices", () => {
  //   for (const { value } of emoteChoices) {
  //     test(`${value} should be on the schema`, () => {
  //       assert(value in emotecounts, `${value} is not on the schema`);
  //     });
  //   }
  // });
});

suite("httpStatus", () => {
  test("is defined", () => {
    assert.isDefined(httpStatus, "httpStatus is not defined");
    assert.isArray(httpStatus, "httpStatus is not an array");
  });
});

suite("motivationalQuotes", () => {
  test("is defined", () => {
    assert.isDefined(motivationalQuotes, "motivationalQuotes is not defined");
    assert.isArray(motivationalQuotes, "motivationalQuotes is not an array");
  });
});

suite("serverInfo", () => {
  test("is defined", () => {
    assert.isDefined(
      accountVerificationMap,
      "accountVerificationMap is not defined"
    );
    assert.isObject(
      accountVerificationMap,
      "accountVerificationMap is not an object"
    );
    assert.isDefined(contentFilterMap, "contentFilterMap is not defined");
    assert.isObject(contentFilterMap, "contentFilterMap is not an object");
  });
});

suite("optOutChoices", () => {
  test("is defined", () => {
    assert.isDefined(optOutChoices, "optOutChoices is not defined");
    assert.isArray(optOutChoices, "optOutChoices is not an array");
  });
});

suite("slimeList", () => {
  test("is defined", () => {
    assert.isDefined(slimeList, "slimeList is not defined");
    assert.isArray(slimeList, "slimeList is not an array");
  });
});

suite("susList", () => {
  test("is defined", () => {
    assert.isDefined(SusList, "susList is not defined");
    assert.isArray(SusList, "susList is not an array");
  });
});

suite("topicList", () => {
  test("is defined", () => {
    assert.isDefined(topicList, "topicList is not defined");
    assert.isString(topicList, "topicList is not a string");
  });
});

suite("translatorList", () => {
  test("is defined", () => {
    assert.isDefined(translatorList, "translatorList is not defined");
    assert.isArray(translatorList, "translatorList is not an array");
  });
});

suite("updatesData", () => {
  test("is defined", () => {
    assert.isDefined(
      updatesSinceLastRelease,
      "updatesSinceLastRelease is not defined"
    );
    assert.isArray(
      updatesSinceLastRelease,
      "updatesSinceLastRelease is not an array"
    );
    assert.isAtMost(
      updatesSinceLastRelease.join("\n").length,
      1024,
      "Update list is too long for an embed field."
    );
  });
});
