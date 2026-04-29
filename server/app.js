require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const router = require("./router/router");
const { connectDB } = require("./db/db");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

startServer();