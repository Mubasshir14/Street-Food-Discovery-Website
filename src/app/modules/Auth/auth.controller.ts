import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const loginUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);
    const { accessToken, refresshToken } = result;

    res.cookie("refreshToken", refresshToken, {
      secure: false,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged in Successfully!",
      data: {
        accessToken: result.accessToken,
      },
    });
  }
);

const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Access Token Generated Successfully!",
      data: result,
    });
  }
);

const changePassword: RequestHandler = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await AuthServices.changePassword(user, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Change Successfully!",
      data: result,
    });
  }
);

const forgotPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthServices.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Check Your Email",
      data: null,
    });
  }
);

const resetPassword: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization || " ";

    const result = await AuthServices.resetPassword(token, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Reset",
      data: null,
    });
  }
);

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
