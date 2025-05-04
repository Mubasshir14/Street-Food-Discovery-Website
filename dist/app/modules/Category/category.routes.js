"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const category_controller_1 = require("./category.controller");
const prisma_1 = require("../../../../generated/prisma");
const router = express_1.default.Router();
router.get("/", category_controller_1.CategoryController.getAllFromDB);
router.get("/:id", category_controller_1.CategoryController.getAllFromDBByID);
router.post("/create-category", (0, auth_1.default)(prisma_1.UserRole.ADMIN), fileUploader_1.FileUploader.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return category_controller_1.CategoryController.createCategory(req, res, next);
});
router.delete("/:id", (0, auth_1.default)(prisma_1.UserRole.ADMIN), category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
