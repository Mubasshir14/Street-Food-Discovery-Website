import { z } from "zod";
import { UserRole } from "../../../../generated/prisma";

const UserRoleEnum = z.enum([UserRole.USER, UserRole.ADMIN]);

const createUser = z.object({
  password: z
    .string({
      required_error: "Password is required!",
    })
    .min(6, {
      message: "Password must be at least 6 characters long!",
    }),
  email: z
    .string({
      required_error: "Email is required!",
    })
    .email({
      message: "Invalid email address!",
    }),
  name: z
    .string({
      required_error: "Name is required!",
    })
    .min(1, {
      message: "Name cannot be empty!",
    })
    .optional(),
});

const loginUser = z.object({
  email: z
    .string({
      required_error: "Email is required!",
    })
    .email({
      message: "Invalid email address!",
    }),
  password: z.string({
    required_error: "Password is required!",
  }),
});

const updateUser = z.object({
  password: z
    .string({
      required_error: "Password is required!",
    })
    .min(6, {
      message: "Password must be at least 6 characters long!",
    })
    .optional(),
  email: z
    .string({
      required_error: "Email is required!",
    })
    .email({
      message: "Invalid email address!",
    })
    .optional(),
  name: z
    .string({
      required_error: "Name is required!",
    })
    .min(1, {
      message: "Name cannot be empty!",
    })
    .optional(),
  role: UserRoleEnum.optional(),
  isPremium: z
    .boolean({
      message: "isPremium must be a boolean!",
    })
    .optional(),
});

const updateUserStatus = z.object({
  body: z.object({
    role: UserRoleEnum.optional(),
    isPremium: z
      .boolean({
        message: "isPremium must be a boolean!",
      })
      .optional(),
  }),
});

export const UserValidation = {
  createUser,
  loginUser,
  updateUser,
  updateUserStatus,
};
