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
  transactionId: string,
  amount: number,
  expiresInDays: number
) => {
  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: {
      paymentId: transactionId,
    },
    include: {
      user: true,
    },
  });

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: user?.email,
    },
  });

  const initPaymentData = {
    amount,
    transactionId: subscription.paymentId,
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
  const response = payload;

  await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.subscription.update({
      where: {
        paymentId: response.tran_id,
      },
      data: {
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

  return {
    message: "Payment successful!",
  };
};

export const PaymentService = {
  initPayment,
  validatePayment,
};
