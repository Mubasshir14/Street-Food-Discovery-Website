import { Request, Response } from "express";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ReviewService } from "./review.service";


const createReview = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.createReview(user as IAuthUser, req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Review created successfully!",
      data: result,
    });
  }
);

const getReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReview();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review fetched successfully!",
    data: result,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getReviewById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review fetched successfully!",
    data: result,
  });
});

const deleteReviewById = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReviewById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review deleted successfully!",
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReview,
  getReviewById,
  deleteReviewById,
};
