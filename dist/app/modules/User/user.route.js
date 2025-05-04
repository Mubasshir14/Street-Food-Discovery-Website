"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../../../generated/prisma");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_validation_1 = require("./user.validation");
const fileUploader_1 = require("../../../helpers/fileUploader");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(prisma_1.UserRole.ADMIN), user_controller_1.UserController.getAllFromDB);
router.get("/me", (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.USER), user_controller_1.UserController.getMyProfile);
router.post("/create-admin", fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createUser.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createAdmin(req, res, next);
});
router.post("/create-user", fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createUser.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createUser(req, res, next);
});
router.patch("/:id/status", (0, auth_1.default)(prisma_1.UserRole.ADMIN), user_controller_1.UserController.changeProfileStatus);
router.patch("/update-my-profile", (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.USER), fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.UserController.updateMyProfile(req, res, next);
});
exports.UserRoutes = router;
