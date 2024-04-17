import { assert } from "chai";

import { handleAbout } from "../../src/commands/subcommands/becca/handleAbout";
import { handleAdventure } from "../../src/commands/subcommands/becca/handleAdventure";
import { handleArt } from "../../src/commands/subcommands/becca/handleArt";
import { handleContact } from "../../src/commands/subcommands/becca/handleContact";
import { handleDonate } from "../../src/commands/subcommands/becca/handleDonate";
import { handleEmote } from "../../src/commands/subcommands/becca/handleEmote";
import { handleHelp } from "../../src/commands/subcommands/becca/handleHelp";
import { handleInvite } from "../../src/commands/subcommands/becca/handleInvite";
import { handlePing } from "../../src/commands/subcommands/becca/handlePing";
import { handlePrivacy } from "../../src/commands/subcommands/becca/handlePrivacy";
import { handleProfile } from "../../src/commands/subcommands/becca/handleProfile";
import { handleStats } from "../../src/commands/subcommands/becca/handleStats";
import { handleTranslators } from "../../src/commands/subcommands/becca/handleTranslators";
import { handleUpdates } from "../../src/commands/subcommands/becca/handleUpdates";
import { handleUptime } from "../../src/commands/subcommands/becca/handleUptime";

suite("handleAbout", () => {
  test("is defined", () => {
    assert.isDefined(handleAbout, "handleAbout is not defined");
    assert.isFunction(handleAbout, "handleAbout is not a function");
  });
});

suite("handleAdventure", () => {
  test("is defined", () => {
    assert.isDefined(handleAdventure, "handleAdventure is not defined");
    assert.isFunction(handleAdventure, "handleAdventure is not a function");
  });
});

suite("handleArt", () => {
  test("is defined", () => {
    assert.isDefined(handleArt, "handleArt is not defined");
    assert.isFunction(handleArt, "handleArt is not a function");
  });
});

suite("handleContact", () => {
  test("is defined", () => {
    assert.isDefined(handleContact, "handleContact is not defined");
    assert.isFunction(handleContact, "handleContact is not a function");
  });
});

suite("handleDonate", () => {
  test("is defined", () => {
    assert.isDefined(handleDonate, "handleDonate is not defined");
    assert.isFunction(handleDonate, "handleDonate is not a function");
  });
});

suite("handleEmote", () => {
  test("is defined", () => {
    assert.isDefined(handleEmote, "handleEmote is not defined");
    assert.isFunction(handleEmote, "handleEmote is not a function");
  });
});

suite("handleHelp", () => {
  test("is defined", () => {
    assert.isDefined(handleHelp, "handleHelp is not defined");
    assert.isFunction(handleHelp, "handleHelp is not a function");
  });
});

suite("handleInvite", () => {
  test("is defined", () => {
    assert.isDefined(handleInvite, "handleInvite is not defined");
    assert.isFunction(handleInvite, "handleInvite is not a function");
  });
});

suite("handlePing", () => {
  test("is defined", () => {
    assert.isDefined(handlePing, "handlePing is not defined");
    assert.isFunction(handlePing, "handlePing is not a function");
  });
});

suite("handlePrivacy", () => {
  test("is defined", () => {
    assert.isDefined(handlePrivacy, "handlePrivacy is not defined");
    assert.isFunction(handlePrivacy, "handlePrivacy is not a function");
  });
});

suite("handleProfile", () => {
  test("is defined", () => {
    assert.isDefined(handleProfile, "handleProfile is not defined");
    assert.isFunction(handleProfile, "handleProfile is not a function");
  });
});

suite("handleStats", () => {
  test("is defined", () => {
    assert.isDefined(handleStats, "handleStats is not defined");
    assert.isFunction(handleStats, "handleStats is not a function");
  });
});

suite("handleTranslators", () => {
  test("is defined", () => {
    assert.isDefined(handleTranslators, "handleTranslators is not defined");
    assert.isFunction(handleTranslators, "handleTranslators is not a function");
  });
});

suite("handleUpdates", () => {
  test("is defined", () => {
    assert.isDefined(handleUpdates, "handleUpdates is not defined");
    assert.isFunction(handleUpdates, "handleUpdates is not a function");
  });
});

suite("handleUptime", () => {
  test("is defined", () => {
    assert.isDefined(handleUptime, "handleUptime is not defined");
    assert.isFunction(handleUptime, "handleUptime is not a function");
  });
});
