const jwt = require("jsonwebtoken");

module.exports = {
  signJwt: (user) => {
    const token = jwt.sign(user, process.env.SECRET_KEY);
    return token;
  },
  verifyJwt: (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) return res.status(403).json({ error: "Forbidden" });

    const bearerToken = bearerHeader.split(" ")[1];
    console.log(bearerToken);
    try {
      const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
      req.decoded = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: "Forbidden" });
    }
  },
};
