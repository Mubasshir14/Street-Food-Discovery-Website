import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import httpStatus from "http-status";
import emailSender from "../../middlewares/emailSender";
import AppError from "../../error/AppError";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password Incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refresshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refresshToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not Authorized");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password Incorrect");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password Change Successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordTOken = jwtHelpers.generateToken(
    {
      email: payload.email,
      role: userData.role,
    },
    config.jwt.reset_password_token as Secret,
    config.jwt.reset_password_token_expiser_in as string
  );

  const resetPasswordLink =
    config.reset_password_link +
    `?userId=${userData.id}&token=${resetPasswordTOken}`;

  await emailSender(
    userData.email,
    `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Dear User,</p>
      <p>You requested to reset your password. Please click the button below:</p>
      <a 
        href="${resetPasswordLink}" 
        style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #007BFF;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>
    </div>
  `
  );

  console.log(resetPasswordLink);
};

const resetPassword = async (
  token: string,
  payload: {
    id: string;
    password: string;
  }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_password_token as Secret
  );

  if (!isValidToken) {
    throw new AppError(httpStatus.FORBIDDEN, "FORBIDDEN");
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);
  await prisma.user.update({
    where: { id: payload.id },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: "Password reset successfully.",
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
