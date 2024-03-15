const router = require("express").Router();
const { authController } = require("../controllers");
const auth = require("../middlewares/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);
router.post("/refresh-tokens", auth, authController.refreshAuth);

module.exports = router;
