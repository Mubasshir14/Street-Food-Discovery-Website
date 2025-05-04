import prisma from "../../../shared/prisma";
import AppError from "../../error/AppError";
import { IAuthUser } from "../../interfaces/common";

const createComment = async (user: IAuthUser, payload: any) => {
  const { postId, content } = payload;

  const userData = await prisma.user.findUnique({
    where: { email: user?.email },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError(404, "Post not found");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: userData?.id as string,
      postId,
    },
  });

  return comment;
};

const getComment = async () => {
  const result = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          name: true,
          profilePhoto: true,
          id: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getCommentByPostId = async (postId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      postId: postId
    },
    include: {
      user: {
        select: {
          name: true,
          profilePhoto: true,
          id: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getCommentById = async (id: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          profilePhoto: true,
          id: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(404, "Not Found");
  }
  return result;
};

const deleteCommentById = async (id: string) => {
  await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });
};

export const CommentService = {
  createComment,
  getComment,
  getCommentByPostId,
  getCommentById,
  deleteCommentById,
};
