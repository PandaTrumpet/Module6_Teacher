// import { Router } from 'express';
// const router = Router();
import express from 'express';
import {
  getAllMoviesController,
  getMovieByIdController,
  addMovieController,
  updateMovieController,
  patchMovieController,
  deleteMovieController,
} from '../controllers/movies-controller.js';
import isValidId from '../middleware/isValidid.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  movieAddSchema,
  movieUpdateSchema,
} from '../validation/movie-schemas.js';
import { upload } from '../middleware/upload.js';
const moviesRouter = express.Router();
moviesRouter.use(authenticate);
moviesRouter.get('/', ctrlWrapper(getAllMoviesController)),
  moviesRouter.get('/:id', isValidId, ctrlWrapper(getMovieByIdController));
moviesRouter.post(
  '/',
  upload.single('poster'), //для одного поля
  //upload.aray('poster',8 ) - ожидай в поле poster  до 8 файлов
  //  upload.fields([{name:"poster", maxCount:1}]) - несколько полей с файлами
  validateBody(movieAddSchema),
  ctrlWrapper(addMovieController),
);
moviesRouter.put(
  '/:id',
  isValidId,
  validateBody(movieAddSchema),
  ctrlWrapper(updateMovieController),
);

moviesRouter.patch(
  '/:id',
  isValidId,
  validateBody(movieUpdateSchema),
  ctrlWrapper(patchMovieController),
);
moviesRouter.delete('/:id', isValidId, ctrlWrapper(deleteMovieController));
export default moviesRouter;
