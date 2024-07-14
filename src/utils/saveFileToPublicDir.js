import fs from 'fs/promises';
import path from 'node:path';
import { TEMP_UPLOAD, PUBLICK_DIR } from '../constants/index.js';
export const saveFileToPublicDir = async (file, filePath) => {
  await fs.rename(file.path);
};
