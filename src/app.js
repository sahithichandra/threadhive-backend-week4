import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import threadRoutes from "./routes/threads.js";
import subredditRoutes from "./routes/subreddits.js";
import auth from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import voteRoutes from "./routes/votes.js";
import errorHandler from "./middleware/errorHandler.js";

import "./models/Thread.js";
import "./models/Subreddit.js";
import "./models/User.js";

const app = express();

// CORS must be before helmet so preflight OPTIONS requests are handled first
app.use(cors());
app.options("/{*path}", cors()); // explicitly handle preflight for all routes (Express 5 syntax)

// Security middlewares — allow cross-origin resource access so CORS works
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use(limiter);

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  }),
);

// Routes
app.use("/api/threads", threadRoutes);
app.use("/api/subreddits", subredditRoutes);
app.use("/api/auth", auth);
app.use("/api/comments", commentRoutes);
app.use("/api", voteRoutes);

app.use(errorHandler);

export default app;
