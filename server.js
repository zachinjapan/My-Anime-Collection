import express from "express";
import dotenv from "dotenv";
import "express-async-errors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

// protections
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import animesRouter from "./routes/animesRoutes.js";
import playlistsRouter from "./routes/playlistsRoutes.js";

// middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

// Load environment variables from .env file
dotenv.config();

// start up the server
const app = express();

// get the app to use JSON as the default data format
app.use(express.json());

// protections
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

//sanitize input
app.use(xss());
// prevents mongodb operator injection from mongoDB queries
app.use(mongoSanitize());

// app level routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/animes", authenticateUser, animesRouter);
app.use("/api/v1/playlists", authenticateUser, playlistsRouter);

// middleware
app.use(errorHandlerMiddleware);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// only when ready to deploy
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./client/build")));

// only when ready to deploy
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// start the server

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
