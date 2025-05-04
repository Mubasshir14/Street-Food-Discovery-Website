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
exports.VoteService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createVote = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, voteType } = payload;
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
    const existingVote = yield prisma_1.default.vote.findFirst({
        where: {
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            postId,
        },
    });
    if (existingVote) {
        if (existingVote.voteType === voteType) {
            return existingVote;
        }
        else {
            return prisma_1.default.vote.update({
                where: { id: existingVote.id },
                data: { voteType },
            });
        }
    }
    return prisma_1.default.vote.create({
        data: {
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            postId,
            voteType,
        },
    });
});
const getVote = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vote.findMany({
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
const getVoteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.vote.findUnique({
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
const deleteVoteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.vote.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.vote.delete({
        where: {
            id,
        },
    });
});
exports.VoteService = {
    createVote,
    getVote,
    getVoteById,
    deleteVoteById,
};
