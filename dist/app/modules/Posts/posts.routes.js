"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const posts_controller_1 = require("./posts.controller");
const prisma_1 = require("../../../../generated/prisma");
const router = express_1.default.Router();
router.get("/get-approved-post", 
// auth(UserRole.ADMIN, UserRole.USER),
posts_controller_1.PostController.getApprovedPostFromDB);
router.get("/get-pending-post", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.getPendingPostFromDB);
router.get("/get-rejected-post", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.getRejectedPostFromDB);
router.get("/get-premium-post", (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.USER), posts_controller_1.PostController.getPremiumPostFromDB);
router.get("/", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.getAllFromDB);
router.get("/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.getPostById);
router.get("/get-approved-post/:id", posts_controller_1.PostController.getApprovedPostById);
router.post("/create-post", (0, auth_1.default)(prisma_1.UserRole.USER), fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return posts_controller_1.PostController.createPost(req, res, next);
});
router.patch("/update-status/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.updatePostStatus);
router.patch("/update-post/:id", (0, auth_1.default)(prisma_1.UserRole.USER), fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return posts_controller_1.PostController.updatePost(req, res, next);
});
router.delete("/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.deletePost);
router.patch("/premium/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.makePostPremium);
router.patch("/regular/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), posts_controller_1.PostController.makePostRegular);
exports.PostRoutes = router;
