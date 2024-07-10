import jwt from 'jsonwebtoken';
import 'dotenv/config';
const { JWT_SECRET } = process.env;
const payload = {
  id: '668d4e9685e6798529e81123',
  email: 'pedoc10481@cartep.com',
};
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

const decodeToken = jwt.decode(token);
// console.log(decodeToken);

try {
  const tokenPayload = jwt.verify(token, JWT_SECRET); // проверка токена
  //   console.log(tokenPayload);
  const invalidTokern =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OGQ0ZTk2ODVlNjc5ODUyOWU4MTEyMyIsImVtYWlsIjoicGVkb2MxMDQ4MUBjYXJ0ZXAuY29tIiwiaWF0IjoxNzIwNTM2ODk2LCJleHAiOjE3MjA2MjMyOTZ9.LOlnk8B9lYkperf0gHnghbW1bDXW6STrog005KbP0ps';
  jwt.verify(invalidTokern, JWT_SECRET);
} catch (error) {
  console.log(error.message);
}
