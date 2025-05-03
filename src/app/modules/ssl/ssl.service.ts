import axios from "axios";
import httpStatus from "http-status";
import { IPaymentData } from "./ssl.interface";
import AppError from "../../error/AppError";
import config from "../../../config";
import SSLCommerzPayment from "sslcommerz-lts";

const store_id = config.sslCommerz.store_id as string;
const store_passwd = config.sslCommerz.store_password as string;
const is_live = false;

const initPayment = async (paymentData: IPaymentData) => {
  try {
    const data = {
      store_id: config.sslCommerz.store_id,
      store_passwd: config.sslCommerz.store_password,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId,
      success_url: `${config.sslCommerz.validation_api}?tran_id=${paymentData.transactionId}`,
      fail_url: config.sslCommerz.failed_url,
      cancel_url: config.sslCommerz.failed_url,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData.phoneNumber,
      cus_fax: "01711111111",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

    try {
      const apiResponse = await sslcz.init(data as any);

      // Redirect the user to the payment gateway
      const GatewayPageURL = apiResponse.GatewayPageURL;
      
      if (GatewayPageURL) {
        return GatewayPageURL;
      } else {
        throw new AppError(500, "Failed to generate payment gateway URL.");
      }
    } catch (error) {
      throw new AppError(500, "An error occurred while processing payment.");
    }

    // const response = await axios({
    //   method: "post",
    //   url: config.sslCommerz.sslPaymentApi,
    //   data: data,
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // });

    // return response.data;
  } catch (err) {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment error occured!");
  }
};

// const validatePayment = async (payload: any) => {
//   try {
//     const response = await axios({
//       method: "GET",
//       url: `${config.sslCommerz.validation_api}?val_id=${payload.val_id}&store_id=${config.sslCommerz.store_id}&store_passwd=${config.sslCommerz.store_password}&format=json`,
//     });

//     return response.data;
//   } catch (err) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Payment validation failed!");
//   }
// };

export const SSLService = {
  initPayment,
  // validatePayment,
};
