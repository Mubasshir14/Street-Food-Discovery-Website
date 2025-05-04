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
exports.CommentService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createComment = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content } = payload;
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
    const comment = yield prisma_1.default.comment.create({
        data: {
            content,
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            postId,
        },
    });
    return comment;
});
const getComment = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.comment.findMany({
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
const getCommentByPostId = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.comment.findMany({
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
});
const getCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.comment.findUnique({
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
const deleteCommentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.comment.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.comment.delete({
        where: {
            id,
        },
    });
});
exports.CommentService = {
    createComment,
    getComment,
    getCommentByPostId,
    getCommentById,
    deleteCommentById,
};
