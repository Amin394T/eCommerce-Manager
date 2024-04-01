import jsonwebtoken from "jsonwebtoken";

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jsonwebtoken.verify(token, "SECRET_KEY");
    req.authorization = { userId: decodedToken.userId };

    if (req.body.userId && req.body.userId != decodedToken.userId) {
      throw "Invalid user ID.";
    } else next();
  } catch {
    res.status(401).json({ error: new Error("Invalid request.") });
  }
};
