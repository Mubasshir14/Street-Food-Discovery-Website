"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../../generated/prisma");
const UserRoleEnum = zod_1.z.enum([prisma_1.UserRole.USER, prisma_1.UserRole.ADMIN]);
const createUser = zod_1.z.object({
    password: zod_1.z
        .string({
        required_error: "Password is required!",
    })
        .min(6, {
        message: "Password must be at least 6 characters long!",
    }),
    email: zod_1.z
        .string({
        required_error: "Email is required!",
    })
        .email({
        message: "Invalid email address!",
    }),
    name: zod_1.z
        .string({
        required_error: "Name is required!",
    })
        .min(1, {
        message: "Name cannot be empty!",
    })
        .optional(),
});
const loginUser = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "Email is required!",
    })
        .email({
        message: "Invalid email address!",
    }),
    password: zod_1.z.string({
        required_error: "Password is required!",
    }),
});
const updateUser = zod_1.z.object({
    password: zod_1.z
        .string({
        required_error: "Password is required!",
    })
        .min(6, {
        message: "Password must be at least 6 characters long!",
    })
        .optional(),
    email: zod_1.z
        .string({
        required_error: "Email is required!",
    })
        .email({
        message: "Invalid email address!",
    })
        .optional(),
    name: zod_1.z
        .string({
        required_error: "Name is required!",
    })
        .min(1, {
        message: "Name cannot be empty!",
    })
        .optional(),
    role: UserRoleEnum.optional(),
    isPremium: zod_1.z
        .boolean({
        message: "isPremium must be a boolean!",
    })
        .optional(),
});
const updateUserStatus = zod_1.z.object({
    body: zod_1.z.object({
        role: UserRoleEnum.optional(),
        isPremium: zod_1.z
            .boolean({
            message: "isPremium must be a boolean!",
        })
            .optional(),
    }),
});
exports.UserValidation = {
    createUser,
    loginUser,
    updateUser,
    updateUserStatus,
};
