"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const category_routes_1 = require("../modules/Category/category.routes");
const posts_routes_1 = require("../modules/Posts/posts.routes");
const comment_route_1 = require("../modules/Comment/comment.route");
const vote_route_1 = require("../modules/Vote/vote.route");
const review_route_1 = require("../modules/Review/review.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: "/post",
        route: posts_routes_1.PostRoutes,
    },
    {
        path: "/comment",
        route: comment_route_1.CommentRouter,
    },
    {
        path: "/vote",
        route: vote_route_1.VoteRouter,
    },
    {
        path: "/review",
        route: review_route_1.ReviewRouter,
    },
    {
        path: "/payment",
        route: payment_route_1.PaymentRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
