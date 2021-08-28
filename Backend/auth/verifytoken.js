// BED assignment 2
// Name: Chian ZhengHang
// Admin number: p2025845
// Class: DISM/FT/2A/01
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config.js');

function verifytoken(req, res, next) {
    const authheader = req.headers.token;
    if (!authheader || !authheader.startsWith("Bearer ")) {
      res.status(401).send();
      return;
    }
    const token = authheader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedtoken) => {
      if (error) {
        res.status(401).send();
        return;
      }
      req.userid = decodedtoken.userid
      req.type = decodedtoken.type
      next();
    });
};

module.exports = verifytoken;