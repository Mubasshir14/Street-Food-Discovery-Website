import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { FileUploader } from "../../../helpers/fileUploader";
import AppError from "../../error/AppError";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { categorySearchAbleFields } from "./category.constant";
import prisma from "../../../shared/prisma";
import { Prisma } from "../../../../generated/prisma";

const createCategory = async (req: Request) => {
  const file = req.file as IFile;

  let image: string | undefined;

  if (file) {
    const uploaded = await FileUploader.uploadToCloudinary(file);
    req.body.image = uploaded?.secure_url;
  }

  const { name } = req.body;

  if (!name) {
    throw new AppError(500, "Category name is required");
  }

  const result = await prisma.category.create({
    data: {
      name,
      image: req.body.image,
    },
  });

  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.CategoryWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: categorySearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
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

  const whereConditons: Prisma.CategoryWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.category.findMany({
    where: whereConditons,
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
      name: true,
      image: true,
    },
  });

  const total = await prisma.category.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAllFromDBByID = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new AppError(404, "Category Not Found!");
  }

  return result;
};

// const deleteCategory = async (id: string) => {
//   await prisma.category.findFirstOrThrow({
//     where: {
//       id,
//     },
//   });

//   const result = await prisma.category.delete({
//     where: {
//       id,
//     },
//   });
// };

const deleteCategory = async (id: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.category.findFirstOrThrow({
      where: { id },
    });

    const posts = await tx.post.findMany({
      where: { categoryId: id },
      select: { id: true },
    });
    const postIds = posts.map((p) => p.id);

    await tx.comment.deleteMany({ where: { postId: { in: postIds } } });
    await tx.vote.deleteMany({ where: { postId: { in: postIds } } });
    await tx.review.deleteMany({ where: { postId: { in: postIds } } });

    await tx.post.deleteMany({ where: { id: { in: postIds } } });

    await tx.category.delete({ where: { id } });
  });
};

const getAdminDashboardStats = async () => {
  const [
    totalPosts,
    pendingPosts,
    approvedPosts,
    rejectedPosts,
    users,
    subscriptions,
    activeSubscriptions,
    payments,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PENDING" } }),
    prisma.post.count({ where: { status: "APPROVED" } }),
    prisma.post.count({ where: { status: "REJECTED" } }),
    prisma.user.count(),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { subcriptionStatus: "ACTIVE" } }),
    prisma.payment.count({ where: { status: "PAID" } }),
  ]);

  return {
    totalPosts,
    pendingPosts,
    approvedPosts,
    rejectedPosts,
    users,
    subscriptions,
    activeSubscriptions,
    payments,
  };
};

const getPaymentByMonth = async () => {
  const paymentsByMonth = await prisma.$queryRaw<
    { month: string; count: number }[]
  >`
      SELECT 
        TO_CHAR("createdAt", 'Mon') AS month, 
        COUNT(*) AS count
      FROM "Payment"
      GROUP BY month
      ORDER BY MIN("createdAt")
    `;

  return paymentsByMonth.map((p) => ({
    name: p.month,
    payments: Number(p.count),
  }));
};

export const CategoryService = {
  createCategory,
  getAllFromDB,
  getAllFromDBByID,
  deleteCategory,
  getAdminDashboardStats,
  getPaymentByMonth,
};
