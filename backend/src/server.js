import express from "express";
import { ENV } from "./lib/env.js";
const app=express();

console.log(ENV.PORT);
app.get("/",(req,res)=>res.send("hello from home"));

app.listen(ENV.PORT,(req,res)=> console.log("server is running"));

