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
import config from "../config";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: config.cloudianary.cloud_name,
  api_key: config.cloudianary.cloud_api_key,
  api_secret: config.cloudianary.cloud_api_secret,
});

const isVercel = process.env.VERCEL === '1';
const uploadPath = isVercel ? '/uploads' : path.join(process.cwd(), 'uploads');

// Create local tmp folder if it doesn't exist
if (!isVercel && !fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error: Error, result: ICloudinaryResponse) => {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const FileUploader = {
  upload,
  uploadToCloudinary,
};