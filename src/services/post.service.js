const prisma = require("../config/prisma");
const ApiError = require("../utils/apiError");

const getPosts = async () => {
  const posts = await prisma.post.findMany({
    take: 20,
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true
        }
      },
      _count: {
        select: {
          like: true,
          comment: true
        }
      }
    }
  });

  return posts;
};

const createPost = async (data, user) => {
  await prisma.post.create({
    data: {
      userId: user.id,
      body: data.body,
      image: data.image
    }
  });
};

const getPost = async (params) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params.postId
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true
        }
      },
      _count: {
        select: {
          like: true,
          comment: true
        }
      }
    }
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  return post;
};

const updatePost = async (params, data, user) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params.postId
    }
  });
  if (!post) {
    throw new ApiError(404, "Post not found");
  } else if (post.userId != user.id) {
    throw new ApiError(403, "Forbidden");
  }

  await prisma.post.update({
    where: {
      id: params.postId
    },
    data: {
      body: data.body
    }
  });
};

const deletePost = async (params, user) => {
  const post = await prisma.post.findUnique({
    where: {
      id: params.postId
    }
  });

  if (!post) {
    throw new ApiError(404, "Post not found");
  } else if (post.userId != user.id) {
    throw new ApiError(403, "Forbidden");
  }

  await prisma.post.delete({
    where: {
      id: params.postId
    }
  });
};

const likePost = async (params, user) => {
  const existingLike = await prisma.likesOnPosts.findUnique({
    where: {
      postId_userId: {
        postId: params.postId,
        userId: user.id
      }
    }
  });

  if (existingLike) {
    await prisma.likesOnPosts.delete({
      where: {
        postId_userId: {
          postId: params.postId,
          userId: user.id
        }
      }
    });

    return;
  }

  await prisma.likesOnPosts.create({
    data: {
      postId: params.postId,
      userId: user.id
    }
  });
};

const createComment = async (data, user) => {
  await prisma.comment.create({
    data: {
      content: data.content,
      userId: user.id,
      postId: data.postId,
      parentId: data.parentId ? data.parentId : undefined
    }
  });
};

const getComments = async (params) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: params.postId,
      parentId: null
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true
        }
      }
    },
    take: 5
  });

  return comments;
};

const getRepliesComment = async (params) => {
  const comments = await prisma.comment.findMany({
    where: {
      parentId: parseInt(params.commentId)
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
          image: true
        }
      }
    },
    take: 5
  });

  return comments;
};

const deleteComment = async (params, user) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: params.commentId
    }
  });

  if (comment.userId != user.id) {
    throw new ApiError(403, "Forbidden");
  }

  await prisma.comment.delete({
    where: {
      id: params.commentId
    }
  });
};

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
