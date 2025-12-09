const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const Routes = require("./routes/index.js");
const config = require("./configs/envConfig.js");
const errorMiddleware = require("./middlewares/error.js");
const sanitizeMiddleware = require("./middlewares/sanitize.js");

const app = express();

app.use(express.json({ limit: config.body }));
app.use(express.urlencoded({ extended: true, limit: config.body }));
app.use(sanitizeMiddleware);

app.use(helmet());
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: config["rate-limit"].window_ms,
  max: config["rate-limit"].max,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});
app.use("/api", limiter);

const normalizeOrigin = (origin) => origin?.toLowerCase().replace(/\/$/, "");
const allowedOrigins = (config.cors || "")
  .split(",")
  .map((o) => o.trim().toLowerCase().replace(/\/$/, ""))
  .filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      if (config.env === "dev") return callback(null, true);
      return callback(null, false);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);

    return callback(
      new Error(`CORS blocked: Origin not allowed (${origin})`),
      false
    );
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};
const corsConfig =
  config.env === "dev" ? { ...corsOptions, origin: true } : corsOptions;
app.use(cors(corsConfig));

app.get("/checkz", (req, res) =>
  res
    .status(200)
    .json({ status: true, message: "API is running successfully!" })
);
app.get("/helthz", (req, res) =>
  res.status(200).json({
    status: true,
    uptime: process.uptime(),
    timestamp: new Date(),
    enviroment: config.env,
  })
);

// API Routes
app.use("/api", Routes);

app.get("/", (req, res) =>
  res
    .status(200)
    .json({ status: true, message: "API is running successfully!" })
);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
