import express from "express";
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/ingest.js";
import { upsertStreamUser } from "./lib/stream.js";
import { clerkMiddleware } from "@clerk/express";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/SessionRoute.js";

const app = express();

app.use(clerkMiddleware());
app.use(express.json());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// ================= INNGEST =================
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

app.get("/", (req, res) => res.send("hello from home"));

// ================= ONLINE COMPILER ROUTE =================

// ================= ONLINE COMPILER ROUTE =================

const COMPILER_MAP = {
  javascript: "typescript-deno",
  python: "python-3.14",
  java: "openjdk-25",
};

app.post("/api/execute", async (req, res) => {
  try {
    const { language, code } = req.body;

    const compiler = COMPILER_MAP[language];

    if (!compiler) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}` ,
      });
    }

    const response = await fetch(
      "https://api.onlinecompiler.io/api/run-code-sync/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.ONLINECOMPILER_API_KEY,
        },
        body: JSON.stringify({
          compiler,
          code,
          input: "",
        }),
      }
    );

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("BODY:", text);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: text,
      });
    }

    const data = JSON.parse(text);

    return res.json({
      success: true,
      output: data.output || "No output",
    });
  } catch (error) {
    console.error("Compiler Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ================= ROUTES =================
app.use("/api/sessions", sessionRoutes);
app.use("/api/chat", chatRoutes);

app.get("/video-calls", protectRoute, (req, res) => {
  console.log("hello");
  res.json({ message: "Video call route working" });
});

// ================= START SERVER =================
const Startsever = async () => {
  await connectDb();

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

Startsever();