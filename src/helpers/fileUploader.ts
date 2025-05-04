// import multer from "multer";
// import path from "path";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
// import config from "../config";

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
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
import config from "../config";

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "/uploads");
    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Function to upload file to Cloudinary
const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  // Check if the file exists before proceeding
  if (!file?.path || !fs.existsSync(file.path)) {
    console.error("File not found or invalid file path:", file?.path);
    throw new Error("File not found or invalid file path");
  }

  // Configure Cloudinary with credentials from config
  cloudinary.config({
    cloud_name: config.cloudianary.cloud_name,
    api_key: config.cloudianary.cloud_api_key,
    api_secret: config.cloudianary.cloud_api_secret,
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file?.path,
      (error: Error, result: ICloudinaryResponse) => {
        // Delete the local file after upload attempt
        try {
          fs.unlinkSync(file?.path);
        } catch (err) {
          console.error("Error deleting file:", err);
        }

        // Handle upload result
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Export the uploader functions
export const FileUploader = {
  upload,
  uploadToCloudinary,
};