import { assert } from "chai";

import { handleLeaderboard } from "../../src/commands/subcommands/community/handleLeaderboard";
import { handleLevel } from "../../src/commands/subcommands/community/handleLevel";
import { handleMotivation } from "../../src/commands/subcommands/community/handleMotivation";
import { handlePoll } from "../../src/commands/subcommands/community/handlePoll";
import { handleRole } from "../../src/commands/subcommands/community/handleRole";
import { handleSchedule } from "../../src/commands/subcommands/community/handleSchedule";
import { handleServer } from "../../src/commands/subcommands/community/handleServer";
import { handleStar } from "../../src/commands/subcommands/community/handleStar";
import { handleStarCount } from "../../src/commands/subcommands/community/handleStarCount";
import { handleSuggest } from "../../src/commands/subcommands/community/handleSuggest";
import { handleTopic } from "../../src/commands/subcommands/community/handleTopic";
import { handleUserInfo } from "../../src/commands/subcommands/community/handleUserInfo";

suite("handleLeaderboard", () => {
  test("is defined", () => {
    assert.isDefined(handleLeaderboard, "handleLeaderboard is not defined");
    assert.isFunction(handleLeaderboard, "handleLeaderboard is not a function");
  });
});

suite("handleLevel", () => {
  test("is defined", () => {
    assert.isDefined(handleLevel, "handleLevel is not defined");
    assert.isFunction(handleLevel, "handleLevel is not a function");
  });
});

suite("handleMotivation", () => {
  test("is defined", () => {
    assert.isDefined(handleMotivation, "handleMotivation is not defined");
    assert.isFunction(handleMotivation, "handleMotivation is not a function");
  });
});

suite("handlePoll", () => {
  test("is defined", () => {
    assert.isDefined(handlePoll, "handlePoll is not defined");
    assert.isFunction(handlePoll, "handlePoll is not a function");
  });
});

suite("handleRole", () => {
  test("is defined", () => {
    assert.isDefined(handleRole, "handleRole is not defined");
    assert.isFunction(handleRole, "handleRole is not a function");
  });
});

suite("handleSchedule", () => {
  test("is defined", () => {
    assert.isDefined(handleSchedule, "handleSchedule is not defined");
    assert.isFunction(handleSchedule, "handleSchedule is not a function");
  });
});

suite("handleServer", () => {
  test("is defined", () => {
    assert.isDefined(handleServer, "handleServer is not defined");
    assert.isFunction(handleServer, "handleServer is not a function");
  });
});

suite("handleStar", () => {
  test("is defined", () => {
    assert.isDefined(handleStar, "handleStar is not defined");
    assert.isFunction(handleStar, "handleStar is not a function");
  });
});

suite("handleStarCount", () => {
  test("is defined", () => {
    assert.isDefined(handleStarCount, "handleStarCount is not defined");
    assert.isFunction(handleStarCount, "handleStarCount is not a function");
  });
});

suite("handleSuggest", () => {
  test("is defined", () => {
    assert.isDefined(handleSuggest, "handleSuggest is not defined");
    assert.isFunction(handleSuggest, "handleSuggest is not a function");
  });
});

suite("handleTopic", () => {
  test("is defined", () => {
    assert.isDefined(handleTopic, "handleTopic is not defined");
    assert.isFunction(handleTopic, "handleTopic is not a function");
  });
});

suite("handleUserInfo", () => {
  test("is defined", () => {
    assert.isDefined(handleUserInfo, "handleUserInfo is not defined");
    assert.isFunction(handleUserInfo, "handleUserInfo is not a function");
  });
});
