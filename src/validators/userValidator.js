const Joi = require("joi");

// Register User Validation
exports.registerUser = {
  body: Joi.object().keys({
    name: Joi.string().min(3).required(),
    email: Joi.string()
      .email()
      .pattern(/^\S+@\S+\.\S+$/)
      .required(),
    password: Joi.string().min(6).required(),
  }),
};

exports.updateUser = {
  body: Joi.object().keys({
    name: Joi.string().min(3).optional(),
    email: Joi.string()
      .email()
      .pattern(/^\S+@\S+\.\S+$/)
      .optional(),
    password: Joi.string().min(6).optional(),
  }),
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};

exports.userById = {
  params: Joi.object().keys({
    id: Joi.string().trim().required(),
  }),
};
