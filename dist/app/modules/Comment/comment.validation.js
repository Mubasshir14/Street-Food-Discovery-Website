"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidation = void 0;
const zod_1 = require("zod");
const createComment = zod_1.z.object({
    content: zod_1.z
        .string({
        required_error: "Comment content is required!",
    })
        .min(1, { message: "Comment content cannot be empty!" }),
    postId: zod_1.z
        .string({
        required_error: "Post ID is required!",
    })
        .uuid({ message: "Invalid Post ID format!" }),
});
const unvote = zod_1.z.object({
    postId: zod_1.z
        .string({
        required_error: "Post ID is required!",
    })
        .uuid({ message: "Invalid Post ID format!" }),
});
const createReview = zod_1.z.object({
    postId: zod_1.z
        .string({
        required_error: "Post ID is required!",
    })
        .uuid({ message: "Invalid Post ID format!" }),
    rating: zod_1.z
        .number({
        required_error: "Rating is required!",
    })
        .int()
        .min(1, { message: "Rating must be between 1 and 5!" })
        .max(5, { message: "Rating must be between 1 and 5!" }),
});
exports.CommentValidation = {
    createComment,
};
