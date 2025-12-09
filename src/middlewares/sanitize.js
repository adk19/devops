const sanitizeHTML = require("sanitize-html");

function clean(value) {
  if (typeof value === "string")
    return sanitizeHTML(value, { allowedTags: [], allowedAttributes: {} });
  return value;
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return;

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    } else {
      obj[key] = clean(obj[key]);
    }
  }
}

module.exports = function sanitizeRequest(req, res, next) {
  sanitizeObject(req.body);
  sanitizeObject(req.params);
  sanitizeObject(req.headers);

  next();
};
