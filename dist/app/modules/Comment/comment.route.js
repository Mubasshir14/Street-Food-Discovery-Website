"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
router.get("/", comment_controller_1.CommentController.getComment);
router.get("/post-comment/:id", comment_controller_1.CommentController.getCommentByPostId);
router.get("/:id", comment_controller_1.CommentController.getCommentById);
router.post("/:id", (0, auth_1.default)(client_1.UserRole.USER), comment_controller_1.CommentController.createComment);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), comment_controller_1.CommentController.deleteCommentById);
exports.CommentRouter = router;
