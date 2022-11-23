require("dotenv").config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

import fluxRoute from "./routes/flux";
app.use("/flux", fluxRoute);

import processRoute from "./routes/process";
app.use("/process", processRoute);

app.get("/", async (req, res) => {
    res.json({version: "0.0.1"});
});

app.listen(3000, () => {
  console.log("My app is listening on port " + port);
});
