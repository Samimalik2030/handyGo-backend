import multer from "multer";
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 30 * 1024 * 1024,
      fieldSize: 30 * 1024 * 1024
    }
  });
export default upload;