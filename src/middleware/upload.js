import multer from 'multer';
import { TEMP_UPLOAD } from '../constants/index.js';
import createHttpError from 'http-errors';
const storage = multer.diskStorage({
  destination: TEMP_UPLOAD,
  filename: (req, file, callback) => {
    //   file.originalname  - оригинальное имя

    const uniquePreffix = Date.now();
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};
const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();
  if (extension === 'exe') {
    return callback(createHttpError(400, '.exe file not allow'));
  }
  callback(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
