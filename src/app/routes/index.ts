import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { PostRoutes } from "../modules/Posts/posts.routes";
import { CommentRouter } from "../modules/Comment/comment.route";
import { VoteRouter } from "../modules/Vote/vote.route";
import { ReviewRouter } from "../modules/Review/review.route";
import { SubscriptionRoutes } from "../modules/Subscription/subscription.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/post",
    route: PostRoutes,
  },
  {
    path: "/comment",
    route: CommentRouter,
  },
  {
    path: "/vote",
    route: VoteRouter,
  },
  {
    path: "/review",
    route: ReviewRouter,
  },
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
