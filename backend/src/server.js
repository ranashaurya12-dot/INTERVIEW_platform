import express from "express";
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import cors from"cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/ingest.js";
import { upsertStreamUser } from "./lib/stream.js";
const app = express();
app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use("/api/inngest",serve({client:inngest,functions}))
app.get("/", (req, res) => res.send("hello from home"));
app.get("/test-stream", async (req, res) => {
  try {
    await upsertStreamUser({
      id: "test123",
      name: "Test User",
      image: "https://getstream.io/random_png/?id=test&name=Test",
    });

    res.send("Stream test success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});
const Startsever = async () => {
  await connectDb();

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

Startsever();