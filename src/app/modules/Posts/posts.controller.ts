import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { PostService } from "./post.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { postFilterableFields } from "./posts.constant";
import { PostStatus } from "@prisma/client";

const createPost: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await PostService.createPost(user as IAuthUser, req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post Created Successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PostService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post  fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getPendingPostFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await PostService.getPendingPostFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getApprovedPostFromDB = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, postFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const user = req.user;
    const result = await PostService.getApprovedPostFromDB(
      filters,
      options,
      user as IAuthUser
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getApprovedPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PostService.getApprovedPostById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post fetched successfully!",
    data: result,
  });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PostService.getPostById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post fetched successfully!",
    data: result,
  });
});

const updatePostStatus: RequestHandler = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const { status } = req.body;
  const postStatus = status as PostStatus;

  const result = await PostService.updatePostStatus(postId, postStatus);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post status updated successfully!",
    data: result,
  });
});

const updatePost: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const postId = req.params.id;
    const user = req.user;

    const result = await PostService.updatePost(postId, user as IAuthUser, req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post updated successfully!",
      data: result,
    });
  }
);

const deletePost: RequestHandler = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const postId = req.params.id;
    const result = await PostService.deletePost(postId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Post deleted successfully!",
      data: result,
    });
  }
);

const makePostPremium: RequestHandler = catchAsync(async (req, res) => {
  const postId = req.params.id;

  const result = await PostService.makePostPremium(postId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated premium successfully!",
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllFromDB,
  getPendingPostFromDB,
  getApprovedPostFromDB,
  getApprovedPostById,
  getPostById,
  updatePostStatus,
  updatePost,
  deletePost,
  makePostPremium,
};
