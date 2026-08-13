import express from "express";
import { ENV } from "./lib/env.js";
import { connectDb } from "./lib/db.js";
import cors from"cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/ingest.js";
import { upsertStreamUser } from "./lib/stream.js";
import{clerkMiddleware} from '@clerk/express';
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from"./routes/chatRoutes.js";
import sessionRoutes from"./routes/SessionRoute.js";
const app = express();
app.use(clerkMiddleware());
app.use(express.json());
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use("/api/inngest",serve({client:inngest,functions}))
app.get("/", (req, res) => res.send("hello from home"));

app.use("/api/sessions", sessionRoutes);
app.use("/api/chat",chatRoutes)

app.get("/video-calls",protectRoute,(req,res)=>{
  console.log("hello")
})
const Startsever = async () => {
  await connectDb();

  app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
  });
};

Startsever();