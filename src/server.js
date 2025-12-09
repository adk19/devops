const app = require("./app.js");
const config = require("./configs/envConfig.js");
const connectDB = require("./configs/db.js");

connectDB();

const server = app.listen(config.port, () =>
  console.log(`Server running on port: ${config.port}`)
);

const gracefulShutdown = (signal) => {
  console.log(`\nRecieved ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log("Force shutdown...");
    process.exit(1);
  });

  setTimeout(() => {
    console.log("Force shutdown...");
    process.exit(1);
  }, 5000).unref();
};

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err?.message}`);
  server.close(() => process.exit(1));
});
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGIERM"));
