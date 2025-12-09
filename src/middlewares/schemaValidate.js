const Joi = require("joi");
const { pick } = require("../helpers/pick.js");

module.exports = (schema) => (req, res, next) => {
  try {
    const validSchema = pick(schema, ["params", "query", "body"]);

    // Only include keys present in schema
    const object = {};
    if (validSchema.params) object.params = req.params;
    if (validSchema.query) object.query = req.query;
    if (validSchema.body) object.body = req.body;

    const { error, value } = Joi.compile(validSchema)
      .prefs({ errors: { label: "key" }, abortEarly: false })
      .validate(object);
    if (error) {
      const errorMsg = error.details.map((detail) => detail.message).join(", ");
      return res.status(400).json({ status: false, error: errorMsg });
    }

    // Safely merge validated data instead of reassigning
    if (value.params) Object.assign(req.params, value.params);
    if (value.query) Object.assign(req.query, value.query);
    if (value.body) Object.assign(req.body, value.body);

    next();
  } catch (err) {
    next(err);
  }
};
