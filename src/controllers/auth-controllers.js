import createHttpError from 'http-errors';
import { findUser, signup, updtaeUser } from '../services/auth-services.js';
import { compareHash } from '../utils/hash.js';
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/session0servise.js';
import { TEMPLATES_DIR } from '../constants/index.js';
// console.log(TEMPLATES_DIR);
import fs from 'node:fs/promises';
import sendEmail from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import handlebars from 'handlebars';
import path from 'node:path';
const app_domain = env('APP_DOMAIN');
const jwt_secret = env('JWT_SECRET');

const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html');

const setupResponseSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const signupController = async (req, res) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    // throw createHttpError(409, 'Email or password invalid');
    throw createHttpError(409, 'Email already in use');
  }
  const newUser = await signup(req.body);
  const payload = {
    id: newUser._id,
    email,
  };
  const token = jwt.sign(payload, jwt_secret);
  const emailTemplateSourse = await fs.readFile(verifyEmailPath, 'utf-8');
  const emailTemplate = handlebars.compile(emailTemplateSourse);
  const html = emailTemplate({
    project_name: 'My movies',
    app_domain,
    token,
  });

  const verifyEmail = {
    subject: 'Verify email',
    to: email,
    html,
  };
  await sendEmail(verifyEmail);
  const data = { name: newUser.name, email: newUser.email };
  res.status(201).json({
    status: 201,
    data,
    message: 'User signup successfuly',
  });
};
//
//
//
//

export const verifyController = async (req, res) => {
  const { token } = req.query;
  try {
    const { id, email } = jwt.verify(token, jwt_secret);
    const user = await findUser({ _id: id, email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    await updtaeUser({ email }, { verify: true });
    res.json({
      status: 200,
      message: 'Email verify successful!',
    });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};
export const signinController = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'Email not found');
  }
  if (!user.verify) {
    throw createHttpError(401, 'Email not verify');
  } // для логина с подтверджденно йпочтой
  const passwordCompare = await compareHash(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Password invalid');
  }

  const session = await createSession(user._id);

  setupResponseSession(res, session);
  res.json({
    satus: 200,
    message: 'Successful',
    data: { accessToken: session.accessToken },
  });
};

export const refreshController = async (req, res) => {
  // console.log(req.cookies); // после установки cookie-parser

  const { sessionId, refreshToken } = req.cookies;
  const currentSession = await findSession({ _id: sessionId, refreshToken }); // проверка на сессию

  if (!currentSession) {
    throw createHttpError(401, 'Session not found');
  }
  const refreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);
  if (refreshTokenExpired) {
    throw createHttpError(401, 'Session expired');
  }

  const newSession = await createSession(currentSession.userId);
  setupResponseSession(res, newSession);
  res.json({
    satus: 200,
    message: 'Successful',
    data: { accessToken: newSession.accessToken },
  });
};

export const signoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    throw createHttpError(401, 'Session not found');
  }
  await deleteSession({ _id: sessionId });
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};
