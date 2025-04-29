import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CategoryService } from "./category.service";
import pick from "../../../shared/pick";
import { categoryFilterableFields } from "./category.constant";

const createCategory: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CategoryService.createCategory(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Category Created Successfully",
      data: result,
    });
  }
);

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await CategoryService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category  fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getAllFromDBByID = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.getAllFromDBByID(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category fetched successfully!",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await CategoryService.deleteCategory(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully!",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllFromDB,
  getAllFromDBByID,
  deleteCategory,
};
