import express from "express";
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import cors from"cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/ingest.js";

const app = express();
app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,Credential:true}))

app.use("/api/inngest",serve({client:inngest,functions}))
app.get("/", (req, res) => res.send("hello from home"));

const Startsever = async () => {
  await connectDb();

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

Startsever();