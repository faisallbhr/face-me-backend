const { postService } = require("../services");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const successResponse = require("../utils/successResponse");

const getPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPosts();
  return successResponse(res, 200, posts, "Successfully get posts");
});

const createPost = catchAsync(async (req, res) => {
  const { body } = req.body;

  if (!body) {
    throw new ApiError(400, "Body is required");
  }

  await postService.createPost(req.body, req.user);

  return successResponse(res, 201, null, "Post created successfully");
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPost(req.params);
  return successResponse(res, 200, post, "Successfully get a post");
});

const updatePost = catchAsync(async (req, res) => {
  const { body } = req.body;
  if (!body) {
    throw new ApiError(400, "Body is required");
  }

  await postService.updatePost(req.params, req.body, req.user);

  return successResponse(res, 201, null, "Post updated successfully");
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params, req.user);
  return successResponse(res, 200, null, "Post deleted successfully");
});

const likePost = catchAsync(async (req, res) => {
  await postService.likePost(req.params, req.user);
  return successResponse(res, 200, null, "Like/unlike successfully");
});

const createComment = catchAsync(async (req, res) => {
  await postService.createComment(req.body, req.user);
  return successResponse(res, 201, null, "Comment created successfully");
});

const getComments = catchAsync(async (req, res) => {
  const comments = await postService.getComments(req.params);
  return successResponse(res, 200, comments, "Successfully get comments");
});

const getRepliesComment = catchAsync(async (req, res) => {
  const comments = await postService.getRepliesComment(req.params);
  return successResponse(res, 200, comments, "Successfully get comments");
});

const deleteComment = catchAsync(async (req, res) => {
  await postService.deleteComment(req.params, req.user);
  return successResponse(res, 200, null, "Comment deleted successfully");
});

module.exports = {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  getComments,
  getRepliesComment,
  deleteComment
};
