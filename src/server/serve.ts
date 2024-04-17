import { readFile } from "fs/promises";
import http from "http";
import https from "https";

import { Webhook } from "@top-gg/sdk";
import cors from "cors";
import express from "express";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { getCounts } from "../modules/becca/getCounts";
import { getOptOutRecord } from "../modules/listeners/getOptOutRecord";
import { sendVoteMessage } from "../modules/server/sendVoteMessage";
import { sendVoteReminder } from "../modules/server/sendVoteReminder";
import { sendVoteReward } from "../modules/server/sendVoteReward";
import { beccaErrorHandler } from "../utils/beccaErrorHandler";
import { beccaLogHandler } from "../utils/beccaLogHandler";

/**
 * Spins up a basic web server for uptime monitoring.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {boolean} True if the server was started, false if it crashed.
 */
export const createServer = async (Becca: BeccaLyria): Promise<boolean> => {
  try {
    const HTTPEndpoint = express();
    const topgg = new Webhook(Becca.configs.topGG, {});
    HTTPEndpoint.disable("x-powered-by");

    const allowedOrigins = [
      "https://dash.beccalyria.com",
      "http://localhost:4200",
    ];

    HTTPEndpoint.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
      })
    );

    HTTPEndpoint.post(
      "/votes",
      topgg.listener(async (payload) => {
        const optout = await getOptOutRecord(Becca, payload.user);

        if (!optout || optout.vote) {
          return;
        }

        const currentMonth = new Date(Date.now()).getMonth();
        let voteType: "bot" | "server" | "unknown" = "unknown";
        const voteRecord = await Becca.db.voters.upsert({
          where: {
            userId: payload.user,
          },
          update: {},
          create: {
            userId: payload.user,
            serverVotes: 0,
            botVotes: 0,
            activeMonth: new Date(Date.now()).getMonth(),
            monthlyVotes: 0,
          },
        });

        const updateData = {
          serverVotes: voteRecord.serverVotes,
          botVotes: voteRecord.botVotes,
          monthlyVotes: voteRecord.monthlyVotes,
          activeMonth: voteRecord.activeMonth,
        };

        if (voteRecord.activeMonth !== currentMonth) {
          if (voteRecord.monthlyVotes > 60) {
            await sendVoteReward(Becca, voteRecord);
          }
          updateData.activeMonth = currentMonth;
          updateData.monthlyVotes = 0;
        }
        voteRecord.monthlyVotes = (voteRecord.monthlyVotes || 0) + 1;

        if (payload.bot === Becca.configs.id) {
          updateData.botVotes = voteRecord.botVotes + 1;
          voteType = "bot";
        }
        if (payload.bot === Becca.configs.id && payload.isWeekend) {
          updateData.botVotes = voteRecord.botVotes + 1;
          voteType = "bot";
        }
        if (payload.guild === Becca.configs.homeGuild) {
          updateData.serverVotes = voteRecord.serverVotes + 1;
          voteType = "server";
        }

        await Becca.db.voters.update({
          where: {
            userId: payload.user,
          },
          data: updateData,
        });

        await sendVoteMessage(Becca, payload, voteRecord, voteType);
        setTimeout(async () => {
          await sendVoteReminder(Becca, payload, voteRecord, voteType);
        }, 1000 * 60 * 60 * 12);
      })
    );

    HTTPEndpoint.use("/about", (_, res) => {
      const data = getCounts(Becca);
      res.json(data);
    });

    HTTPEndpoint.use("/", (_, res) => {
      res.status(200).send("Ping!");
    });

    const httpPort = 1080;

    const httpServer = http.createServer(HTTPEndpoint);

    httpServer.listen(httpPort, () => {
      beccaLogHandler.log("http", `http server is live on port ${httpPort}`);
    });

    if (process.env.NODE_ENV === "production") {
      const privateKey = await readFile(
        "/etc/letsencrypt/live/bot.beccalyria.com/privkey.pem",
        "utf8"
      );
      const certificate = await readFile(
        "/etc/letsencrypt/live/bot.beccalyria.com/cert.pem",
        "utf8"
      );
      const ca = await readFile(
        "/etc/letsencrypt/live/bot.beccalyria.com/chain.pem",
        "utf8"
      );

      const credentials = {
        key: privateKey,
        cert: certificate,
        ca,
      };

      const httpsServer = https.createServer(credentials, HTTPEndpoint);
      httpsServer.listen(1443, () => {
        beccaLogHandler.log("http", "https server is live on port 443");
      });
    }
    return true;
  } catch (err) {
    await beccaErrorHandler(Becca, "create server", err);
    return false;
  }
};
