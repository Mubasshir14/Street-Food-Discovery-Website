import AppError from "../../error/AppError";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const createReview = async (user: IAuthUser, payload: any) => {
  const { postId, rating } = payload;

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

  const existingReview = await prisma.review.findFirst({
    where: {
      userId: userData?.id,
      postId,
    },
  });

  if (existingReview) {
    return prisma.review.update({
      where: { id: existingReview.id },
      data: { rating },
    });
  }

  return prisma.review.create({
    data: {
      rating,
      userId: userData?.id as string,
      postId,
    },
  });
};

const getReview = async () => {
  const result = await prisma.review.findMany({
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

const getReviewById = async (id: string) => {
  const result = await prisma.review.findUnique({
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

const deleteReviewById = async (id: string) => {
  await prisma.review.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.review.delete({
    where: {
      id,
    },
  });
};

export const ReviewService = {
  createReview,
  getReview,
  getReviewById,
  deleteReviewById,
};
