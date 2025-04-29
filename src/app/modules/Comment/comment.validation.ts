import { z } from "zod";

const createComment = z.object({
  content: z
    .string({
      required_error: "Comment content is required!",
    })
    .min(1, { message: "Comment content cannot be empty!" }),
  postId: z
    .string({
      required_error: "Post ID is required!",
    })
    .uuid({ message: "Invalid Post ID format!" }),
});

const unvote = z.object({
  postId: z
    .string({
      required_error: "Post ID is required!",
    })
    .uuid({ message: "Invalid Post ID format!" }),
});

const createReview = z.object({
  postId: z
    .string({
      required_error: "Post ID is required!",
    })
    .uuid({ message: "Invalid Post ID format!" }),
  rating: z
    .number({
      required_error: "Rating is required!",
    })
    .int()
    .min(1, { message: "Rating must be between 1 and 5!" })
    .max(5, { message: "Rating must be between 1 and 5!" }),
});

export const CommentValidation = {
  createComment,
};
