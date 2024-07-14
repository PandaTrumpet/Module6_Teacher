// console.log('JHello');
// import { releaseYearRegexp } from './constants/movies-constants.js';
// console.log(releaseYearRegexp.test('2000'));
import initMongoDB from './db/nitMongoDB.js';
import startServer from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD, PUBLICK_DIR, POSTER_DIR } from './constants/index.js';
const bootstrap = async () => {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD);
  await createDirIfNotExists(PUBLICK_DIR);
  await createDirIfNotExists(POSTER_DIR);
  startServer();
};
bootstrap();
