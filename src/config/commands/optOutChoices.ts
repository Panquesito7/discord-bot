import { APIApplicationCommandOptionChoice } from "discord.js";

import { OptOutSettings } from "../../interfaces/settings/OptOutSettings";

export const optOutChoices: APIApplicationCommandOptionChoice<OptOutSettings>[] =
  [
    { name: "Activity System", value: "activity" },
    { name: "Emote System", value: "emote" },
    { name: "Level System", value: "level" },
    { name: "Star System", value: "star" },
    { name: "Vote System", value: "vote" },
  ];
