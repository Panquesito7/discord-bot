import { BeccaLyria } from "../interfaces/BeccaLyria";

import { autoModerationActionExecution } from "./automodEvents/autoModerationActionExecution";
import { disconnect } from "./clientEvents/disconnect";
import { ready } from "./clientEvents/ready";
import { guildAuditLogEntryCreate } from "./guildEvents/guildAuditLogEntryCreate";
import { guildCreate } from "./guildEvents/guildCreate";
import { guildDelete } from "./guildEvents/guildDelete";
import { interactionCreate } from "./interactionEvents/interactionCreate";
import { memberAdd } from "./memberEvents/memberAdd";
import { memberRemove } from "./memberEvents/memberRemove";
import { memberUpdate } from "./memberEvents/memberUpdate";
import { messageCreate } from "./messageEvents/messageCreate";
import { messageDelete } from "./messageEvents/messageDelete";
import { messageUpdate } from "./messageEvents/messageUpdate";
import { reactionAdd } from "./reactionEvents/reactionAdd";
import { shardError } from "./shardEvents/shardError";
import { shardReady } from "./shardEvents/shardReady";
import { threadCreate } from "./threadEvents/threadCreate";
import { threadDelete } from "./threadEvents/threadDelete";
import { threadUpdate } from "./threadEvents/threadUpdate";
import { userUpdate } from "./userEvents/userUpdate";
import { voiceStateUpdate } from "./voiceEvents/voiceStateUpdate";

/**
 * Root level function for loading all of the event listeners. Attaches
 * all of the Discord.js event listeners to Becca's custom handlers.
 *
 * @param {BeccaLyria} Becca Becca's Client instance.
 */
export const handleEvents = (Becca: BeccaLyria): void => {
  Becca.on("shardReady", async (shard) => {
    await shardReady(Becca, shard);
  });
  Becca.on("shardError", async (error, shard) => {
    await shardError(Becca, error, shard);
  });

  Becca.on("messageCreate", async (message) => {
    await messageCreate(Becca, message);
  });
  Becca.on("messageDelete", async (message) => {
    await messageDelete(Becca, message);
  });
  Becca.on("messageUpdate", async (oldMessage, newMessage) => {
    await messageUpdate(Becca, oldMessage, newMessage);
  });

  Becca.on("guildCreate", async (guild) => {
    await guildCreate(Becca, guild);
  });
  Becca.on("guildDelete", async (guild) => {
    await guildDelete(Becca, guild);
  });

  Becca.on("guildMemberAdd", async (member) => {
    await memberAdd(Becca, member);
  });
  Becca.on("guildMemberRemove", async (member) => {
    await memberRemove(Becca, member);
  });
  Becca.on("guildMemberUpdate", async (oldMember, newMember) => {
    await memberUpdate(Becca, oldMember, newMember);
  });
  Becca.on("userUpdate", async (oldUser, newUser) => {
    await userUpdate(Becca, oldUser, newUser);
  });

  Becca.on("ready", async () => {
    await ready(Becca);
  });
  Becca.on("disconnect", async () => {
    await disconnect(Becca);
  });

  Becca.on("voiceStateUpdate", async (oldState, newState) => {
    await voiceStateUpdate(Becca, oldState, newState);
  });

  Becca.on("threadCreate", async (thread) => {
    await threadCreate(Becca, thread);
  });
  Becca.on("threadUpdate", async (oldThread, newThread) => {
    await threadUpdate(Becca, oldThread, newThread);
  });
  Becca.on("threadDelete", async (thread) => {
    await threadDelete(Becca, thread);
  });

  Becca.on("interactionCreate", async (interaction) => {
    await interactionCreate(Becca, interaction);
  });

  Becca.on("messageReactionAdd", async (reaction) => {
    await reactionAdd(Becca, reaction);
  });

  Becca.on("guildAuditLogEntryCreate", async (entry, guild) => {
    await guildAuditLogEntryCreate(Becca, entry, guild);
  });
  Becca.on("autoModerationActionExecution", async (action) => {
    await autoModerationActionExecution(Becca, action);
  });
};
