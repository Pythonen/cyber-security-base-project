const express = require("express");
const cors = require("cors");
const { signToken, verifyToken } = require("./jwtToken");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyUser = async (req, res, next) => {
  const auth = req.get("Authorization");
  let token;
  if (auth) {
    token = auth;
  }
  try {
    const legitUser = await verifyToken(token);
    if (legitUser) {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(403);
    res.json({ message: "Unauthorized" });
  }
};

app.get("/diaries", verifyUser, async (_, res) => {
  const ret = [];
  db.each(
    "SELECT title, body FROM diary",
    (err, data) => {
      if (err) return err;
      ret.push(data);
    },
    () => {
      res.json(ret);
      return;
    }
  );
});

app.post("/register", (req, res) => {
  const { name, password } = req.body;
  db.run(
    `INSERT INTO user(name, password) VALUES ('${name}','${password}')`,
    (err) => {
      if (err) {
        return res.json({ message: "User already exists!" });
      } else {
        return res.json({ message: "User created" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  db.all(
    `SELECT * FROM user WHERE name='${name}' AND password='${password}'`,
    (err, row) => {
      if (Object.keys(row).length !== 0) {
        signToken({ name, password }).then((data) => {
          return res.json(data);
        });
      } else {
        console.log(err);
        return res.json({ message: "Name or password wrong" });
      }
    }
  );
});

app.post("/diary", verifyUser, (req, res) => {
  const { title, ret } = req.body;
  db.run(
    `INSERT INTO diary(title, body) VALUES ('${title}', '${ret}')`,
    (err, _) => {
      if (err) console.error(err);
      return res.json({ message: "Item added" });
    }
  );
});

module.exports = app;
