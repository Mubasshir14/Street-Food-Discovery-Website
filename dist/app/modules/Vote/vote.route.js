"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const vote_controller_1 = require("./vote.controller");
const prisma_1 = require("../../../../generated/prisma");
const router = express_1.default.Router();
router.get("/", vote_controller_1.VoteController.getVote);
router.get("/:id", vote_controller_1.VoteController.getVoteById);
router.post("/:postId", (0, auth_1.default)(prisma_1.UserRole.USER), vote_controller_1.VoteController.createVote);
router.delete("/:postId/", (0, auth_1.default)(prisma_1.UserRole.USER), vote_controller_1.VoteController.deleteVoteById);
exports.VoteRouter = router;
