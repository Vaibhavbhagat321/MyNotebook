const connnectToMongo = require("./ds");
const express = require("express");
const cors = require("cors");
// require("dotenv").config();
// const userKey = process.env.USER_ID;

connnectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`inotebook server listening on port http://localhost:${port}`);
  //   console.log(userKey);
});
