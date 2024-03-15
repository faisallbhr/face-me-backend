const router = require("express").Router();
const auth = require("../middlewares/auth");
const { postController } = require("../controllers");

router;

router
  .get("/", postController.getPosts)
  .post("/", auth, postController.createPost)
  .get("/:postId", postController.getPost)
  .put("/:postId", auth, postController.updatePost)
  .delete("/:postId", auth, postController.deletePost)
  .post("/:postId/like", auth, postController.likePost)
  .get("/:postId/comments", postController.getComments)
  .post("/comments", auth, postController.createComment)
  .get("/comments/:commentId", postController.getRepliesComment)
  .delete("/comments/:commentId", auth, postController.deleteComment);

module.exports = router;
