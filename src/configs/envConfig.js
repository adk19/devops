require("dotenv").config();
const Joi = require("joi");

const envVarsSchema = Joi.object({
  PORT: Joi.number().integer().required(),
  NODE_ENV: Joi.string().trim().required(),
  REQUEST_BODY_LIMIT: Joi.string().trim().required(),

  RATE_LIMIT_WINDOW_MS: Joi.number().integer().required(),
  RATE_LIMIT_MAX: Joi.number().integer().required(),

  CORS_ORIGIN: Joi.string().trim().required(),

  MONGODB_URL: Joi.string().trim().required(),

  JWT_SECRET: Joi.string().trim().required(),
  JWT_EXPIRES_IN: Joi.string().trim().required(),
}).unknown();

const { error, value: envVars } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error?.message}`);
}

module.exports = {
  port: envVars.PORT,
  env: envVars.NODE_ENV,
  body: envVars.REQUEST_BODY_LIMIT,
  cors: envVars.CORS_ORIGIN,
  mongo: envVars.MONGODB_URL,
  "rate-limit": {
    window_ms: Number(envVars.RATE_LIMIT_WINDOW_MS),
    max: Number(envVars.RATE_LIMIT_MAX),
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expire: envVars.JWT_EXPIRES_IN,
  },
};
