import { Request, Response } from "express";
import httpStatus from "http-status";
import { IAuthUser } from "../../interfaces/common";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { VoteService } from "./vote.service";

const createVote = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const comment = await VoteService.createVote(user as IAuthUser, req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Vote created successfully!",
      data: comment,
    });
  }
);

const getVote = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteService.getVote();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vote fetched successfully!",
    data: result,
  });
});

const getVoteById = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteService.getVoteById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vote fetched successfully!",
    data: result,
  });
});

const deleteVoteById = catchAsync(async (req: Request, res: Response) => {
  const result = await VoteService.deleteVoteById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vote deleted successfully!",
    data: result,
  });
});

export const VoteController = {
  createVote,
  getVote,
  getVoteById,
  deleteVoteById,
};
