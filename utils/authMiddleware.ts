import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';

const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error('Internal Server Error: No Secret Key');
}

export const withAuth = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Unauthorized: No Authorization Header' });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No Token Provided' });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Token' });
    }
  };
};
