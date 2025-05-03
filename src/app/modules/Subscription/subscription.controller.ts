import { Request, Response } from "express";
import { SubcriptionService } from "./subscription.service";

// const initiatePayment = async (req: Request, res: Response) => {
//   try {
//     const { userId, amount } = req.body;
//     if (!userId || !amount) {
//       return res.status(400).json({ error: "userId and amount are required" });
//     }
//     const paymentUrl = await SubcriptionService.initiatePayment(userId, amount);
//     res.status(200).json({ paymentUrl });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

const handlePaymentSuccess = async (req: Request, res: Response) => {
  try {
    const { tran_id, status } = req.body;
    if (status === "VALID") {
      await SubcriptionService.updateSubscriptionStatus(tran_id, "ACTIVE");
      res.redirect("http://your-frontend-url/success");
    } else {
      throw new Error("Invalid payment status");
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const handlePaymentFail = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;
    await SubcriptionService.updateSubscriptionStatus(tran_id, "CANCELLED");
    res.redirect("http://your-frontend-url/fail");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const handlePaymentCancel = async (req: Request, res: Response) => {
  try {
    const { tran_id } = req.body;
    await SubcriptionService.updateSubscriptionStatus(tran_id, "CANCELLED");
    res.redirect("http://your-frontend-url/cancel");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const subscriptions = await SubcriptionService.getUserSubscriptions(userId);
    res.status(200).json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const SubcriptionController = {
//   initiatePayment,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  getUserSubscriptions,
};
