import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CommentController } from "./comment.controller";

const router = express.Router();

router.get("/", CommentController.getComment);
router.get("/:id", CommentController.getCommentById);
router.post("/:postId", auth(UserRole.USER), CommentController.createComment);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CommentController.deleteCommentById
);

export const CommentRouter = router;
