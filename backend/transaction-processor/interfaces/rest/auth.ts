import express from "express";
import env from "../../env";

const router = express.Router();

const authenticateUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid authorization header" });
  }

  if (token !== env.AUTH_TOKEN) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
};

router.use(authenticateUser);

export default router;