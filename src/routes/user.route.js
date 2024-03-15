const router = require("express").Router();
const { userController } = require("../controllers");
const auth = require("../middlewares/auth");

router.route("/:id").get(auth, userController.getUser);

module.exports = router;
