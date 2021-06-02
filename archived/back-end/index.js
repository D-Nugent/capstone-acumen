const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./api/users");
const businessRoute = require("./api/business");
const userVideoRoute = require("./api/userVideo");
const interviewEnvRoute = require("./api/interviewEnv");

dotenv.config();

app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
  console.log(`The path '${req.path}' was targeted at ${new Date().toLocaleTimeString()}`);
  next();
});

app.use("/users", userRoute);
app.use("/business", businessRoute);
app.use("/user-video", userVideoRoute);
app.use("/interview-env", interviewEnvRoute);

app.listen(process.env.PORT, (error) => (error ? console.error(error) : console.info("Acumen is up and running!")));
