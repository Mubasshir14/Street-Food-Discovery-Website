import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { SSLService } from "../ssl/ssl.service";

// type InitPaymentData = {
//   amount: number;
//   transactionId: string;
//   name: string;
//   email: string;
//   address?: string;
//   phoneNumber?: string;
// };

const initPayment = async (
  user: IAuthUser,
  amount: number,
  expiresInDays: number
) => {
  const now = new Date();
  const transactionId = `FOODWEBSITE-${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  //   http://localhost:3000/success?trx_id=FOODWEBSITE-2025-5-3-16-39

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
    paymentUrl: result.GatewayPageURL,
  };
};

const validatePayment = async (payload: any) => {
  await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: {
        paymentId: payload.trx_id,
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
      },
    });
    console.log(sub);

    await tx.user.update({
      where: {
        id: updatedPayment.userId,
      },
      data: {
        isPremium: true,
      },
    });
  });

  return {
    message: "Payment successful!",
  };
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
