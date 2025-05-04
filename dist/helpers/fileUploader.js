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
exports.FileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), "/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: config_1.default.cloudianary.cloud_name,
        api_key: config_1.default.cloudianary.cloud_api_key,
        api_secret: config_1.default.cloudianary.cloud_api_secret,
    });
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file === null || file === void 0 ? void 0 : file.path, 
        //   {
        //     public_id: file?.originalname,
        //   },
        (error, result) => {
            fs_1.default.unlinkSync(file === null || file === void 0 ? void 0 : file.path);
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
// import multer from "multer";
// import path from "path";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
// import config from "../config";
// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(process.cwd(), "/uploads");
//     // Create the uploads directory if it doesn't exist
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// // Initialize multer with the storage configuration
// const upload = multer({ storage: storage });
// // Function to upload file to Cloudinary
// const uploadToCloudinary = async (
//   file: IFile
// ): Promise<ICloudinaryResponse | undefined> => {
//   // Check if the file exists before proceeding
//   if (!file?.path || !fs.existsSync(file.path)) {
//     console.error("File not found or invalid file path:", file?.path);
//     throw new Error("File not found or invalid file path");
//   }
//   // Configure Cloudinary with credentials from config
//   cloudinary.config({
//     cloud_name: config.cloudianary.cloud_name,
//     api_key: config.cloudianary.cloud_api_key,
//     api_secret: config.cloudianary.cloud_api_secret,
//   });
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file?.path,
//       (error: Error, result: ICloudinaryResponse) => {
//         // Delete the local file after upload attempt
//         try {
//           fs.unlinkSync(file?.path);
//         } catch (err) {
//           console.error("Error deleting file:", err);
//         }
//         // Handle upload result
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };
// // Export the uploader functions
// export const FileUploader = {
//   upload,
//   uploadToCloudinary,
// };
