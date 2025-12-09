const router = require("express").Router();
const validate = require("../middlewares/schemaValidate.js");
const userValidation = require("../validators/userValidator.js");
const userController = require("../controllers/userController.js");

router.post(
  "/",
  validate(userValidation.registerUser),
  userController.registerUser,
);
router.patch(
  "/:id",
  validate(userValidation.updateUser),
  userController.updateUser,
);
router.get("/list", userController.getUserList);
router.get(
  "/:id",
  validate(userValidation.userById),
  userController.getUserById,
);
router.delete(
  "/:id",
  validate(userValidation.userById),
  userController.deleteUser,
);

module.exports = router;
