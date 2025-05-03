export type IPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  userId: string;
  expiresIn: number;
  address: string | null;
  phoneNumber: string | null;
};
