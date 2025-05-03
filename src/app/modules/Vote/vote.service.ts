import AppError from "../../error/AppError";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const createVote = async (user: IAuthUser, payload: any) => {
  const { postId, voteType } = payload;

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

  const existingVote = await prisma.vote.findFirst({
    where: {
      userId: userData?.id as string,
      postId,
    },
  });

  if (existingVote) {
    if (existingVote.voteType === voteType) {
      return existingVote;
    } else {
      return prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType },
      });
    }
  }

  return prisma.vote.create({
    data: {
      userId: userData?.id as string,
      postId,
      voteType,
    },
  });
};

const getVote = async () => {
  const result = await prisma.vote.findMany({
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

const getVoteById = async (id: string) => {
  const result = await prisma.vote.findUnique({
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

const deleteVoteById = async (id: string) => {
  await prisma.vote.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.vote.delete({
    where: {
      id,
    },
  });
};

export const VoteService = {
  createVote,
  getVote,
  getVoteById,
  deleteVoteById,
};
