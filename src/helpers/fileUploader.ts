import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), "/uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp"); // ✅ Vercel এ writable path
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  cloudinary.config({
    cloud_name: "dtvievcwd",
    api_key: "948253568621974",
    api_secret: "N3DupnhD6k_IMs3-eW4UnAfMIWw",
  });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file?.path,
      //   {
      //     public_id: file?.originalname,
      //   },
      (error: Error, result: ICloudinaryResponse) => {
        fs.unlinkSync(file?.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const FileUploader = {
  upload,
  uploadToCloudinary,
};
