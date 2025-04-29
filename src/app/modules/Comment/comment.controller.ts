import { Request, Response } from "express";
import httpStatus from "http-status";

import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;

    const comment = await CommentService.createComment(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Comment created successfully!",
      data: comment,
    });
  }
);

const getComment = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentService.getComment();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment fetched successfully!",
    data: comment,
  });
});

const getCommentById = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentService.getCommentById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment fetched successfully!",
    data: comment,
  });
});

const deleteCommentById = catchAsync(async (req: Request, res: Response) => {
  const comment = await CommentService.deleteCommentById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment deleted successfully!",
    data: comment,
  });
});

export const CommentController = {
  createComment,
  getComment,
  getCommentById,
  deleteCommentById,
};
