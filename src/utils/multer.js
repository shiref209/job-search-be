import multer from "multer";

export const fileValidation = [
  {
    image: ["image/jpeg", "image/png", "image/gif", "image/jpg"],
    file: ["application/pdf", "application/msword"],
  },
];

const uploadHandler = ({ isSingle = true, fileValidation = [] } = {}) => {
  return (req, res, next) => {
    const storage = multer.diskStorage({});

    const fileFilter = (req, file, cb) => {
      if (!fileValidation.includes(file.mimetype)) {
        cb(new Error("file type not supported"), false);
      } else {
        cb(null, true);
      }
    };
    const upload = multer({
      storage,
      fileFilter,
    });
    if (isSingle) {
      return upload.single(uploadType);
    }
    return upload.array(uploadType, 4);
  };
};
export default uploadHandler;
