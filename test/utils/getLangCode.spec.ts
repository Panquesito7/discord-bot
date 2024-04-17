import { assert } from "chai";
import { Interaction, Message } from "discord.js";

import {
  getInteractionLanguage,
  getMessageLanguage,
} from "../../src/utils/getLangCode";

suite("getInteractionLanguage", () => {
  test("is defined", () => {
    assert.isDefined(
      getInteractionLanguage,
      "getInteractionLanguage is not defined"
    );
    assert.isFunction(
      getInteractionLanguage,
      "getInteractionLanguage is not a function"
    );
  });

  test("returns locale when present", () => {
    const interaction = {
      locale: "en-US",
    } as Interaction;
    assert.equal(getInteractionLanguage(interaction), "en-US");
  });

  test("returns guild locale when present", () => {
    const interaction = {
      guildLocale: "en-US",
    } as Interaction;
    assert.equal(getInteractionLanguage(interaction), "en-US");
  });

  test("returns en-GB when neither present", () => {
    const interaction = {} as Interaction;
    assert.equal(getInteractionLanguage(interaction), "en-GB");
  });

  test("prioritises user locale over guild locale", () => {
    const interaction = {
      locale: "en-US",
      guildLocale: "en-FAKE",
    } as Interaction;
    assert.equal(getInteractionLanguage(interaction), "en-US");
  });
});

suite("getMessageLanguage", () => {
  test("is defined", () => {
    assert.isDefined(getMessageLanguage, "getMessageLanguage is not defined");
    assert.isFunction(
      getMessageLanguage,
      "getMessageLanguage is not a function"
    );
  });

  test("returns guild preferred locale when present", () => {
    const message = {
      guild: {
        preferredLocale: "en-US",
      },
    } as Message;
    assert.equal(getMessageLanguage(message), "en-US");
  });

  test("returns en-GB when not present", () => {
    const message = {} as Message;
    assert.equal(getMessageLanguage(message), "en-GB");
  });
});
