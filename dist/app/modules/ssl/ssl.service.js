"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSLService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../../config"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const store_id = config_1.default.sslCommerz.store_id;
const store_passwd = config_1.default.sslCommerz.store_password;
const is_live = false;
const initPayment = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: config_1.default.sslCommerz.store_id,
            store_passwd: config_1.default.sslCommerz.store_password,
            total_amount: paymentData.amount,
            currency: "BDT",
            tran_id: paymentData.transactionId,
            success_url: `${config_1.default.sslCommerz.validation_api}?tran_id=${paymentData.transactionId}`,
            fail_url: config_1.default.sslCommerz.failed_url,
            cancel_url: config_1.default.sslCommerz.failed_url,
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
        const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
        try {
            const apiResponse = yield sslcz.init(data);
            // Redirect the user to the payment gateway
            const GatewayPageURL = apiResponse.GatewayPageURL;
            if (GatewayPageURL) {
                return GatewayPageURL;
            }
            else {
                throw new AppError_1.default(500, "Failed to generate payment gateway URL.");
            }
        }
        catch (error) {
            throw new AppError_1.default(500, "An error occurred while processing payment.");
        }
        // const response = await axios({
        //   method: "post",
        //   url: config.sslCommerz.sslPaymentApi,
        //   data: data,
        //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // });
        // return response.data;
    }
    catch (err) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment error occured!");
    }
});
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
exports.SSLService = {
    initPayment,
    // validatePayment,
};
