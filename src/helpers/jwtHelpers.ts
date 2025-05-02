// import jwt, { JwtPayload, Secret } from "jsonwebtoken";

// const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
//   const token = jwt.sign(payload, secret, {
//     algorithm: "HS256",
//     expiresIn,
//   });

//   return token;
// };

// const verifyToken = (token: string, secret: Secret) => {
//   return jwt.verify(token, secret) as JwtPayload;
// };

// export const jwtwtHelpers = {
//   generateToken,
//   verifyToken
// };


import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: any) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });

  return token;
};

const verifyToken = (authorizationHeader: string, secret: Secret): JwtPayload => {
  if (!authorizationHeader) {
    throw new Error("Authorization header is missing");
  }

  const splitToken = authorizationHeader.split(" ");
  
  if (splitToken.length !== 2 || splitToken[0] !== "Bearer") {
    throw new Error("Invalid token format");
  }

  const accessToken = splitToken[1];

  return jwt.verify(accessToken, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
