import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { FileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import AppError from "../../error/AppError";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { postSearchAbleFields } from "./posts.constant";
import { PostStatus, Prisma } from "@prisma/client";

const createPost = async (user: IAuthUser, req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploaded = await FileUploader.uploadToCloudinary(file);
    req.body.image = uploaded?.secure_url;
  }

  const {
    title,
    description,
    priceRange,
    location,
    categoryId,
    status,
    isPremium,
  } = req.body;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError(404, "Invalid Category ID");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  const result = await prisma.post.create({
    data: {
      title,
      description,
      priceRange,
      location,
      image: req.body.image,
      categoryId,
      userId: userData?.id as string,
      status,
      isPremium: false,
    },
  });
  console.log('service', result);
  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.PostWhereInput[] = [];

  if (searchTerm) {
    andCondions.push({
      OR: postSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PostWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: "desc",
            },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        image: true,
        categoryId: true,
        priceRange: true,
        userId: true,
        status: true,
      },
    }),
    prisma.post.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getPendingPostFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.PostWhereInput[] = [];

  andCondions.push({
    status: "PENDING",
  });

  if (searchTerm) {
    andCondions.push({
      OR: postSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PostWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: "desc",
            },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        image: true,
        categoryId: true,
        priceRange: true,
        userId: true,
        status: true,
      },
    }),
    prisma.post.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getApprovedPostFromDB = async (
  params: any,
  options: IPaginationOptions,
  user?: IAuthUser
) => {
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.PostWhereInput[] = [];

  andCondions.push({
    status: PostStatus.APPROVED,
  });

  const userData = await prisma.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (userData && userData.isPremium) {
  } else if (userData && userData.isPremium) {
    andCondions.push({
      isPremium: false,
    });
  } else {
    andCondions.push({
      isPremium: false,
    });
  }

  if (searchTerm) {
    andCondions.push({
      OR: postSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.PostWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? {
              [options.sortBy]: options.sortOrder,
            }
          : {
              createdAt: "desc",
            },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        image: true,
        categoryId: true,
        priceRange: true,
        userId: true,
        status: true,
      },
    }),
    prisma.post.count({
      where: whereConditions,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getApprovedPostById = async (id: string) => {
  const result = await prisma.post.findUnique({
    where: {
      id,
      status: PostStatus.APPROVED,
    },
  });

  if (!result) {
    throw new AppError(404, "NOT FOUND!");
  }
  return result;
};

const getPostById = async (id: string) => {
  const result = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new AppError(404, "NOT FOUND!");
  }
  return result;
};

const updatePostStatus = async (postId: string, status: PostStatus) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new AppError(404, "Post not found");
  }

  if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    throw new AppError(400, "Invalid status value");
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { status },
  });

  return updated;
};

const updatePost = async (postId: string, user: IAuthUser, req: Request) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new AppError(404, "Post not found");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: user?.email },
  });

  if (!currentUser || existingPost.userId !== currentUser.id) {
    throw new AppError(403, "You are not authorized to update this post");
  }

  const file = req.file as IFile;

  if (file) {
    const uploaded = await FileUploader.uploadToCloudinary(file);
    req.body.image = uploaded?.secure_url;
  }

  const { title, description, priceRange, location } = req.body;

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      description,
      priceRange,
      location,
      image: req.body.image,
      status: "APPROVED",
    },
  });

  return updatedPost;
};

const deletePost = async (id: string) => {
  await prisma.post.findFirstOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.post.delete({
    where: {
      id,
    },
  });
};

const makePostPremium = async (postId: string) => {
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existingPost) {
    throw new AppError(404, "Post not found");
  }

  if (existingPost.status !== "APPROVED") {
    throw new AppError(400, "Only approved posts can be made premium");
  }

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { isPremium: true },
  });

  return updated;
};

export const PostService = {
  createPost,
  getAllFromDB,
  getPendingPostFromDB,
  getApprovedPostFromDB,
  getApprovedPostById,
  getPostById,
  updatePostStatus,
  updatePost,
  deletePost,
  makePostPremium,
};
