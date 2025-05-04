"use strict";
// import multer from "multer";
// import path from "path";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
// import config from "../config";
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
exports.FileUploader = void 0;
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), "/uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage: storage });
// const uploadToCloudinary = async (
//   file: IFile
// ): Promise<ICloudinaryResponse | undefined> => {
//   cloudinary.config({
//     cloud_name: config.cloudianary.cloud_name,
//     api_key: config.cloudianary.cloud_api_key,
//     api_secret: config.cloudianary.cloud_api_secret,
//   });
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file?.path,
//       //   {
//       //     public_id: file?.originalname,
//       //   },
//       (error: Error, result: ICloudinaryResponse) => {
//         fs.unlinkSync(file?.path);
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };
// export const FileUploader = {
//   upload,
//   uploadToCloudinary,
// };
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudianary.cloud_name,
    api_key: config_1.default.cloudianary.cloud_api_key,
    api_secret: config_1.default.cloudianary.cloud_api_secret,
});
const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/uploads' : path_1.default.join(process.cwd(), 'uploads');
// Create local tmp folder if it doesn't exist
if (!isVercel && !fs_1.default.existsSync(uploadPath)) {
    fs_1.default.mkdirSync(uploadPath);
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, (error, result) => {
            try {
                fs_1.default.unlinkSync(file.path);
            }
            catch (e) {
                console.error('Error deleting temp file:', e);
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
});
exports.FileUploader = {
    upload,
    uploadToCloudinary,
};
