"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
const prisma_1 = require("../../../../generated/prisma");
const fileUploader_1 = require("../../../helpers/fileUploader");
const bcrypt = __importStar(require("bcrypt"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constant_1 = require("./user.constant");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        role: prisma_1.UserRole.ADMIN,
        profilePhoto: req.body.profilePhoto,
    };
    const result = yield prisma_2.default.user.create({
        data: userData,
    });
    return result;
});
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        role: prisma_1.UserRole.USER,
        profilePhoto: req.body.profilePhoto,
    };
    const result = yield prisma_2.default.user.create({
        data: userData,
    });
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.PaginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_constant_1.userSearchAbleFields.map((field) => ({
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
    const result = yield prisma_2.default.user.findMany({
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
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_2.default.user.count({
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
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_2.default.user.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const updateUserStatus = yield prisma_2.default.user.update({
        where: {
            id,
        },
        data: status,
    });
    return updateUserStatus;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_2.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: prisma_1.UserStatus.ACTIVE,
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
    const profileInfo = yield prisma_2.default.user.findUnique({
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
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_2.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: prisma_1.UserStatus.ACTIVE,
        },
    });
    const file = req.file;
    let profilePhoto;
    if (file) {
        const uploadResult = yield fileUploader_1.FileUploader.uploadToCloudinary(file);
        if (uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url) {
            profilePhoto = uploadResult.secure_url;
        }
    }
    const { name } = req.body;
    const updatedProfile = yield prisma_2.default.user.update({
        where: {
            email: userInfo.email,
        },
        data: {
            name,
            profilePhoto,
        },
    });
    return updatedProfile;
});
exports.UserService = {
    createAdmin,
    createUser,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile,
};
