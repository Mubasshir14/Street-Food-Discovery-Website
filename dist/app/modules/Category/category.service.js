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
exports.CategoryService = void 0;
const fileUploader_1 = require("../../../helpers/fileUploader");
const AppError_1 = __importDefault(require("../../error/AppError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const category_constant_1 = require("./category.constant");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createCategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let image;
    if (file) {
        const uploaded = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.image = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
    }
    const { name } = req.body;
    if (!name) {
        throw new AppError_1.default(500, "Category name is required");
    }
    const result = yield prisma_1.default.category.create({
        data: {
            name,
            image: req.body.image,
        },
    });
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: category_constant_1.categorySearchAbleFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma_1.default.category.findMany({
        where: whereConditons,
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
            name: true,
            image: true,
        },
    });
    const total = yield prisma_1.default.category.count({
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
});
const getAllFromDBByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findUnique({
        where: {
            id,
        },
    });
    if (!result) {
        throw new AppError_1.default(404, "Category Not Found!");
    }
    return result;
});
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
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.category.findFirstOrThrow({
            where: { id },
        });
        const posts = yield tx.post.findMany({
            where: { categoryId: id },
            select: { id: true },
        });
        const postIds = posts.map((p) => p.id);
        yield tx.comment.deleteMany({ where: { postId: { in: postIds } } });
        yield tx.vote.deleteMany({ where: { postId: { in: postIds } } });
        yield tx.review.deleteMany({ where: { postId: { in: postIds } } });
        yield tx.post.deleteMany({ where: { id: { in: postIds } } });
        yield tx.category.delete({ where: { id } });
    }));
});
const getAdminDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalPosts, pendingPosts, approvedPosts, rejectedPosts, users, subscriptions, activeSubscriptions, payments,] = yield Promise.all([
        prisma_1.default.post.count(),
        prisma_1.default.post.count({ where: { status: "PENDING" } }),
        prisma_1.default.post.count({ where: { status: "APPROVED" } }),
        prisma_1.default.post.count({ where: { status: "REJECTED" } }),
        prisma_1.default.user.count(),
        prisma_1.default.subscription.count(),
        prisma_1.default.subscription.count({ where: { subcriptionStatus: "ACTIVE" } }),
        prisma_1.default.payment.count({ where: { status: "PAID" } }),
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
});
const getPaymentByMonth = () => __awaiter(void 0, void 0, void 0, function* () {
    const paymentsByMonth = yield prisma_1.default.$queryRaw `
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
});
exports.CategoryService = {
    createCategory,
    getAllFromDB,
    getAllFromDBByID,
    deleteCategory,
    getAdminDashboardStats,
    getPaymentByMonth,
};
