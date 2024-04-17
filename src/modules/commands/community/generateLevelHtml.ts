import { newlevels } from "@prisma/client";
import { User } from "discord.js";

import levelScale from "../../../config/listeners/levelScale";
import { BeccaLyria } from "../../../interfaces/BeccaLyria";

/**
 * Module to generate HTML for a user's level card.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @param {User} user The user's record from Discord.
 * @param {newlevels} levelData The user's level data.
 * @returns {string} An HTML string for the user's level card.
 */
export const generateLevelHtml = async (
  Becca: BeccaLyria,
  user: User,
  levelData: newlevels
) => {
  const levelConfig = await Becca.db.userconfigs.findUnique({
    where: { userId: user.id },
  });
  const colours = {
    background: levelConfig?.levelcard?.background || "#3a3240",
    foreground: levelConfig?.levelcard?.foreground || "#aea8de",
    progress: levelConfig?.levelcard?.progress || "#ffffff",
  };
  const pointsForNextLevel =
    levelData.level < 100 ? levelScale[levelData.level + 1] : null;
  const pointsForCurrentLevel = levelScale[levelData.level];
  const progressToNextLevel = pointsForNextLevel
    ? Math.round(
        ((levelData.points - pointsForCurrentLevel) /
          (pointsForNextLevel - pointsForCurrentLevel)) *
          100
      )
    : 100;
  const progressString = pointsForNextLevel
    ? `${levelData.points.toLocaleString()}/${pointsForNextLevel?.toLocaleString()}`
    : "MAX LEVEL";
  const html = `
<div class="user">
  <img
    class="avatar"
    src="${user.displayAvatarURL({
      extension: "png",
      size: 128,
    })}"
    onError="this.onError=null;this.src='https://dash.beccalyria.com/assets/img/default.png';"
  />
  <div class="details">
    <div class="username">${user.username}</div>
    <div class="level">Level ${levelData.level} - ${progressString}</div>
  </div>
  <div class="progress">
    <div class="progress-info">${progressToNextLevel}% to next level:</div>
    <progress class="progress-bar" value="${progressToNextLevel}" max="100"></progress>
  </div>
</div>
`;

  const style = `
.user {
  display: grid;
  grid-template-areas:
    "img details"
    "img progress";
  max-width: 500px;
  margin: 10px auto;
  padding: 10px 0;
  background-color: ${colours.background};
  color: ${colours.foreground};
  justify-items: center;
  align-items: center;
  border-radius: 25px;
  font-size: 1.25rem;
}

.avatar {
  grid-area: img;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.details {
  grid-area: details;
  margin-bottom: 10px;
}

.username {
  font-size: 1.75rem;
  font-weight: bold;
}

.progress {
  grid-area: progress;
}

progress[value] {
  /* Reset the default appearance */
  -webkit-appearance: none;
  appearance: none;

  width: 250px;
  height: 20px;
}

progress[value]::-webkit-progress-bar {
  background-color: ${colours.foreground};
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
}

progress[value]::-webkit-progress-value {
  border-radius: 10px;
  background-color: ${colours.progress};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
}
`;

  return `<style>${style}</style>${html}`;
};
