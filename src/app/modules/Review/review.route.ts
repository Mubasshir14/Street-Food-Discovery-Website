import express from "express";
import auth from "../../middlewares/auth";
import { ReviewController } from "./review.controller";
import { UserRole } from "../../../../generated/prisma";


const router = express.Router();

router.get("/", ReviewController.getReview);
router.get("/:id", ReviewController.getReviewById);
router.post("/:postId", auth(UserRole.USER), ReviewController.createReview);
router.delete("/:postId/", auth(UserRole.USER), ReviewController.deleteReviewById);

export const ReviewRouter = router;
