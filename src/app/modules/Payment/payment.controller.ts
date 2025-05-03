import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { IAuthUser } from "../../interfaces/common";

const initPayment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { amount, expiresIn } = req.body;
    const user = req.user;
    if (!amount || !expiresIn) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Amount and expiresIn are required"
      );
    }

    const result = await PaymentService.initPayment(
      user as IAuthUser,
      amount,
      expiresIn
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment initiated successfully",
      data: result,
    });
  }
);

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.validatePayment(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});

export const PaymentController = {
  initPayment,
  validatePayment,
};
