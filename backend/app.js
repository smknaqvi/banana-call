const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.post("/", (req, res, next) => {
  res.status(200).send("Success: " + req.body.image);
});

const http = require("http");
const PORT = 5000;

http.createServer(app).listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
