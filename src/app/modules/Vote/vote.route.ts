import express from "express";
import auth from "../../middlewares/auth";
import { VoteController } from "./vote.controller";
import { UserRole } from "../../../../generated/prisma";

const router = express.Router();

router.get("/", VoteController.getVote);
router.get("/:id", VoteController.getVoteById);
router.post("/:postId", auth(UserRole.USER), VoteController.createVote);
router.delete("/:postId/", auth(UserRole.USER), VoteController.deleteVoteById);

export const VoteRouter = router;
