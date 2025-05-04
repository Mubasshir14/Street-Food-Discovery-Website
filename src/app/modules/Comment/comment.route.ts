import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CommentController } from "./comment.controller";

const router = express.Router();

router.get("/", CommentController.getComment);
router.get("/post-comment/:id", CommentController.getCommentByPostId);
router.get("/:id", CommentController.getCommentById);
router.post("/:id", auth(UserRole.USER), CommentController.createComment);
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CommentController.deleteCommentById
);

export const CommentRouter = router;
