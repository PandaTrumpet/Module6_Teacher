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
const moviesRouter = express.Router();
moviesRouter.use(authenticate);
moviesRouter.get('/', ctrlWrapper(getAllMoviesController)),
  moviesRouter.get('/:id', isValidId, ctrlWrapper(getMovieByIdController));
moviesRouter.post(
  '/',
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
