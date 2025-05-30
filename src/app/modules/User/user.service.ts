import { Request } from "express";
import { Prisma, UserRole, UserStatus } from "../../../../generated/prisma";
import { FileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PaginationHelper } from "../../../helpers/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prisma";

const createAdmin = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await FileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.email,
    name: req.body.name,
    password: hashedPassword,
    role: UserRole.ADMIN,
    profilePhoto: req.body.profilePhoto,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

const createUser = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await FileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.email,
    name: req.body.name,
    password: hashedPassword,
    role: UserRole.USER,
    profilePhoto: req.body.profilePhoto,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = PaginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
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

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
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
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
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

const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      profilePhoto: true,
      isPremium: true,
    },
  });

  const profileInfo = await prisma.user.findUnique({
    where: { email: userInfo.email },
    select: {
      name: true,
      email: true,
      role: true,
      status: true,
      profilePhoto: true,
      isPremium: true,
    },
  });

  return {
    ...userInfo,
    ...profileInfo,
  };
};

const updateMyProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const file = req.file as IFile;
  let profilePhoto: string | undefined;

  if (file) {
    const uploadResult = await FileUploader.uploadToCloudinary(file);
    if (uploadResult?.secure_url) {
      profilePhoto = uploadResult.secure_url;
    }
  }

  const { name } = req.body;

  const updatedProfile = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: {
      name,
      profilePhoto,
    },
  });

  return updatedProfile;
};

export const UserService = {
  createAdmin,
  createUser,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
