"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createReview = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, rating } = payload;
    const userData = yield prisma_1.default.user.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.email },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    const post = yield prisma_1.default.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        throw new AppError_1.default(404, "Post not found");
    }
    const existingReview = yield prisma_1.default.review.findFirst({
        where: {
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            postId,
        },
    });
    if (existingReview) {
        return prisma_1.default.review.update({
            where: { id: existingReview.id },
            data: { rating },
        });
    }
    return prisma_1.default.review.create({
        data: {
            rating,
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            postId,
        },
    });
});
const getReview = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findMany({
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
});
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.review.findUnique({
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
        throw new AppError_1.default(404, "Not Found");
    }
    return result;
});
const deleteReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.review.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.review.delete({
        where: {
            id,
        },
    });
});
exports.ReviewService = {
    createReview,
    getReview,
    getReviewById,
    deleteReviewById,
};
