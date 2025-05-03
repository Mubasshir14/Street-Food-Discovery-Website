import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_password_token: process.env.RESET_PASSWORD_TOKEN,
    reset_password_token_expiser_in:
      process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
  },
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  emailSender: {
    email: process.env.EMAIL,
    app_password: process.env.APP_PASSWORD,
  },
  sslCommerz: {
    store_id: process.env.STORE_ID,
    store_password: process.env.STORE_PASSWORD,
    success_url: process.env.SUCCESS_URL,
    failed_url: process.env.FAIL_URL,
    cancel_url: process.env.CANCEL_URL,
    is_live: process.env.is_live,
    sslPaymentApi: process.env.SSL_PAYMENT_API,
    validation_api: process.env.VALIDATION_API,
  },
};
