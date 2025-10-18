import jsonwebtoken from "jsonwebtoken";
import { raiseError } from "../utilities/ErrorMsg.js";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.authorization = { userId: decodedToken.userId };

    if (req.body.userId && req.body.userId != decodedToken.userId) {
      throw raiseError('Authentication failed', 401);
    }
    else next();
  }
  catch (error) {
    next(error);
  }
};
