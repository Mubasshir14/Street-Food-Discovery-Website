"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.get("/", review_controller_1.ReviewController.getReview);
router.get("/:id", review_controller_1.ReviewController.getReviewById);
router.post("/:postId", (0, auth_1.default)(client_1.UserRole.USER), review_controller_1.ReviewController.createReview);
router.delete("/:postId/", (0, auth_1.default)(client_1.UserRole.USER), review_controller_1.ReviewController.deleteReviewById);
exports.ReviewRouter = router;
