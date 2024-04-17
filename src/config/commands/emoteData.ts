import { APIApplicationCommandOptionChoice } from "discord.js";

export const emoteChoices: APIApplicationCommandOptionChoice<EmoteAction>[] = [
  { name: "Give them a hug!", value: "hug" },
  { name: "Give them a kiss!", value: "kiss" },
  { name: "Smack them around a bit.", value: "smack" },
  { name: "Boop them on the nose!", value: "boop" },
  { name: "Throw something at them.", value: "throw" },
  { name: "Pat them on the head.", value: "pat" },
  { name: "Go UwU at them", value: "uwu" },
];

export const throwList = [
  "a ball",
  "some knives",
  "a table",
  "a pumpkin",
  "a book or two",
  "an entire human being",
  "the whole Moon",
  "a very angry cat",
  "some rotten tomatoes",
  "the tesseract",
  "Becca's buggy code",
];

export const smackList = [
  "their hand",
  "a balloon",
  "one of those foam fingers",
  "a wet towel",
  "a banana peel",
  "a newspaper",
  "some raw meat",
];

export type EmoteAction =
  | "hug"
  | "kiss"
  | "smack"
  | "boop"
  | "throw"
  | "pat"
  | "uwu";
