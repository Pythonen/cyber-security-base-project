const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, "verysecretkey", { expiresIn: "1h" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "verysecretkey", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports = {
  signToken,
  verifyToken,
};
