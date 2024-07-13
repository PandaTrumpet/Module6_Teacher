import {
  getMovies,
  adddMOvie,
  upsertMovie,
  deleteMovie,
  getMovie,
} from '../services/movie-services.js';
import createHttpError from 'http-errors';
import parsePaginationParam from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { movieFiledList } from '../constants/movies-constants.js';

import parseMovieFilterParams from '../utils/parseMovieFilterParams.js';
export const getAllMoviesController = async (req, res) => {
  const { _id: userId } = req.user;

  const { page, perPage } = parsePaginationParam(req.query);
  const { sortBy, sortOder } = parseSortParams(req.query, movieFiledList);
  const filter = { ...parseMovieFilterParams(req.query), userId };

  console.log(req.query); // передает парметрі пагинации
  const data = await getMovies({
    page,
    perPage,
    sortBy,
    sortOder,
    filter,
  });
  res.json({
    status: 200,
    data,
    message: 'Success',
  });
};
import { movieAddSchema } from '../validation/movie-schemas.js';
export const getMovieByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { id } = req.params;
  const data = await getMovie({ _id: id, userId });
  // if (!data) {
  //   return res.status(404).json({
  //     status: 404,
  //     message: 'Movie  not found',
  //   });
  // }
  if (!data) {
    throw createHttpError(404, `Movie with id=${id} not found`);
    //   const error = new Error('Movie not found');
    //   error.status = 404;
    //   throw error;
  }

  res.json({
    status: 200,
    data,
    message: `Success with ${id}`,
  });
  //   } catch (error) {
  //     if (error.message.includes('Cast to ObjectId failed')) {
  //       error.status = 404;
  //     }
  //     // const { status = 500 } = error;
  //     // res.status(status).json({
  //     //   status,
  //     //   data: error,
  //     //   message: error.message,
  //     // });
  //     next(error);
  //   }
};

export const addMovieController = async (req, res) => {
  // console.log(req.body);

  // console.log(validationResult.error);

  // console.log(req.user);
  const { _id: userId } = req.user;
  console.log(req.file);
  const result = await adddMOvie({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successful',
    data: result,
  });
};

export const updateMovieController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await upsertMovie({ _id: id, userId }, req.body, {
    upsert: true,
  });
  console.log(data);
  const status = data.isNew ? 201 : 200;
  const message = data.isNew ? 'Movie success add' : 'Movie update success';
  res.json({
    status,
    message,
    data: data.value,
  });
};

export const patchMovieController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await upsertMovie({ _id: id, userId }, req.body);
  console.log(result);
  if (!result) {
    throw createHttpError(404, `Movie not found`);
  }
  res.json({
    status: 200,
    message: 'Movie update success',
    data: result.data,
  });
};

export const deleteMovieController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await deleteMovie({ _id: id, userId });
  if (!result) {
    throw createHttpError(404, `Movie not found`);
  }

  res.json({
    status: 200,
    message: 'Delete movie success',
    data: result,
  });
};
