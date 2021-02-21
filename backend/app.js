const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const tensor = require("@tensorflow/tfjs-node");
const canvas = require("canvas");
const faceapi = require("face-api.js");
const { Canvas, Image, ImageData } = canvas;
const router = require("./routes.js");
const fetch = require("node-fetch");

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
faceapi.env.monkeyPatch({ fetch: fetch });

app.use(bodyParser({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/*app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});*/

app.post("/", (req, res, next) => {
  res.status(200).send("Success: " + req.body.image);
});
app.use("", router);
const http = require("http");
const PORT = 5000;

http.createServer(app).listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
