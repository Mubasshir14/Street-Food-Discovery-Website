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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const AppError_1 = __importDefault(require("../../error/AppError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const posts_constant_1 = require("./posts.constant");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const prisma_2 = require("../../../../generated/prisma");
const createPost = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploaded = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.image = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
    }
    const { title, description, priceRange, location, categoryId, status, isPremium, } = req.body;
    const category = yield prisma_1.default.category.findUnique({
        where: { id: categoryId },
    });
    if (!category) {
        throw new AppError_1.default(404, "Invalid Category ID");
    }
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    const result = yield prisma_1.default.post.create({
        data: {
            title,
            description,
            priceRange,
            location,
            image: req.body.image,
            categoryId,
            userId: userData === null || userData === void 0 ? void 0 : userData.id,
            status,
            isPremium: false,
        },
    });
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (searchTerm) {
        andCondions.push({
            OR: posts_constant_1.postSearchAbleFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondions.length > 0 ? { AND: andCondions } : {};
    const [data, total] = yield Promise.all([
        prisma_1.default.post.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
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
                comments: true,
                votes: true,
                reviews: true,
                isPremium: true,
            },
        }),
        prisma_1.default.post.count({
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
});
const getPendingPostFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm, status } = params, filterData = __rest(params, ["searchTerm", "status"]);
    const andCondions = [];
    andCondions.push({
        status: prisma_2.PostStatus.PENDING,
    });
    if (searchTerm) {
        andCondions.push({
            OR: posts_constant_1.postSearchAbleFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondions.length > 0 ? { AND: andCondions } : {};
    const [data, total] = yield Promise.all([
        prisma_1.default.post.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
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
                comments: true,
                votes: true,
                reviews: true,
                isPremium: true,
            },
        }),
        prisma_1.default.post.count({
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
});
const getApprovedPostFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    andCondions.push({
        status: prisma_2.PostStatus.APPROVED,
        isPremium: false
    });
    // const userData = await prisma.user.findUnique({
    //   where: {
    //     email: user?.email,
    //   },
    // });
    // if (userData && userData.isPremium) {
    // } else if (userData && userData.isPremium) {
    //   andCondions.push({
    //     isPremium: false,
    //   });
    // } else {
    //   andCondions.push({
    //     isPremium: false,
    //   });
    // }
    if (searchTerm) {
        andCondions.push({
            OR: posts_constant_1.postSearchAbleFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondions.length > 0 ? { AND: andCondions } : {};
    const [data, total] = yield Promise.all([
        prisma_1.default.post.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
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
                comments: true,
                votes: true,
                reviews: true,
                isPremium: true,
            },
        }),
        prisma_1.default.post.count({
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
});
const getRejectedPostFromDB = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    andCondions.push({
        status: prisma_2.PostStatus.REJECTED,
    });
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    if (userData && userData.isPremium) {
    }
    else if (userData && userData.isPremium) {
        andCondions.push({
            isPremium: false,
        });
    }
    else {
        andCondions.push({
            isPremium: false,
        });
    }
    if (searchTerm) {
        andCondions.push({
            OR: posts_constant_1.postSearchAbleFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondions.length > 0 ? { AND: andCondions } : {};
    const [data, total] = yield Promise.all([
        prisma_1.default.post.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
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
                comments: true,
                votes: true,
                reviews: true,
                isPremium: true,
            },
        }),
        prisma_1.default.post.count({
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
});
const getPremiumPostFromDB = (params, options, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    andCondions.push({
        status: prisma_2.PostStatus.APPROVED,
        isPremium: true,
    });
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
        },
    });
    if (userData && userData.isPremium) {
    }
    else if (userData && userData.isPremium) {
        andCondions.push({
            isPremium: true,
        });
    }
    else {
        andCondions.push({
            isPremium: true,
        });
    }
    if (searchTerm) {
        andCondions.push({
            OR: posts_constant_1.postSearchAbleFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andCondions.length > 0 ? { AND: andCondions } : {};
    const [data, total] = yield Promise.all([
        prisma_1.default.post.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: options.sortBy && options.sortOrder
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
                isPremium: true,
                comments: true,
                votes: true,
                reviews: true,
            },
        }),
        prisma_1.default.post.count({
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
});
const getApprovedPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.post.findUnique({
        where: {
            id,
            status: prisma_2.PostStatus.APPROVED,
        },
        include: {
            comments: true,
            reviews: true,
            votes: true,
        },
    });
    if (!result) {
        throw new AppError_1.default(404, "NOT FOUND!");
    }
    return result;
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.post.findUnique({
        where: {
            id,
        },
        include: {
            comments: true,
            reviews: true,
            votes: true,
        },
    });
    if (!result) {
        throw new AppError_1.default(404, "NOT FOUND!");
    }
    return result;
});
const updatePostStatus = (postId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPost = yield prisma_1.default.post.findUnique({
        where: { id: postId },
    });
    if (!existingPost) {
        throw new AppError_1.default(404, "Post not found");
    }
    if (!["APPROVED", "REJECTED"].includes(status)) {
        throw new AppError_1.default(400, "Invalid status value");
    }
    const updated = yield prisma_1.default.post.update({
        where: { id: postId },
        data: { status },
    });
    return updated;
});
const updatePost = (postId, user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPost = yield prisma_1.default.post.findUnique({
        where: { id: postId },
    });
    if (!existingPost) {
        throw new AppError_1.default(404, "Post not found");
    }
    const currentUser = yield prisma_1.default.user.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.email },
    });
    if (!currentUser || existingPost.userId !== currentUser.id) {
        throw new AppError_1.default(403, "You are not authorized to update this post");
    }
    const file = req.file;
    if (file) {
        const uploaded = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.image = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
    }
    const { title, description, priceRange, location } = req.body;
    const updatedPost = yield prisma_1.default.post.update({
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
});
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.post.findFirstOrThrow({
        where: {
            id,
        },
    });
    const result = yield prisma_1.default.post.delete({
        where: {
            id,
        },
    });
});
const makePostPremium = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPost = yield prisma_1.default.post.findUnique({
        where: { id: postId },
    });
    if (!existingPost) {
        throw new AppError_1.default(404, "Post not found");
    }
    if (existingPost.status !== "APPROVED") {
        throw new AppError_1.default(400, "Only approved posts can be made premium");
    }
    const updated = yield prisma_1.default.post.update({
        where: { id: postId },
        data: { isPremium: true },
    });
    return updated;
});
const makePostRegular = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPost = yield prisma_1.default.post.findUnique({
        where: { id: postId },
    });
    if (!existingPost) {
        throw new AppError_1.default(404, "Post not found");
    }
    if (existingPost.status !== "APPROVED") {
        throw new AppError_1.default(400, "Only approved posts can be made premium");
    }
    const updated = yield prisma_1.default.post.update({
        where: { id: postId },
        data: { isPremium: false },
    });
    return updated;
});
exports.PostService = {
    createPost,
    getAllFromDB,
    getPendingPostFromDB,
    getApprovedPostFromDB,
    getRejectedPostFromDB,
    getApprovedPostById,
    getPostById,
    updatePostStatus,
    updatePost,
    deletePost,
    makePostPremium,
    makePostRegular,
    getPremiumPostFromDB,
};
