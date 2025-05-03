import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { SSLService } from "../ssl/ssl.service";
import { v4 as uuidv4 } from "uuid";

const initPayment = async (
  user: IAuthUser,
  amount: number,
  expiresInDays: number
) => {
  const transactionId = `Street-Food-Discovery-Website-${uuidv4()}`;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const newSubscription = await prisma.payment.create({
    data: {
      amount,
      paymentId: transactionId,
      userId: userData.id,
      expiresAt,
      status: "UNPAID",
    },
  });

  const initPaymentData = {
    amount,
    transactionId: transactionId,
    name: userData.name || "Unknown",
    email: userData.email,
    address: "N/A",
    phoneNumber: "N/A",
    userId: userData.id,
    expiresIn: expiresInDays,
  };

  const result = await SSLService.initPayment(initPaymentData);

  return {
    paymentUrl: result,
  };
};

const validatePayment = async (payload: any) => {
  await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        paymentId: payload.tran_id,
      },
      data: {
        status: "PAID",
      },
    });

    const sub = await tx.subscription.create({
      data: {
        userId: updatedPayment.userId,
        paymentId: updatedPayment.paymentId,
        subcriptionStatus: "ACTIVE",
        expiresAt: updatedPayment.expiresAt,
        status: "PAID",
      },
    });

    await tx.user.update({
      where: {
        id: updatedPayment.userId,
      },
      data: {
        isPremium: true,
      },
    });
  });

  // return {
  //   message: "Payment successful!",
  // };
  return true;
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
