const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL , password TEXT NOT NULL, admin int  DEFAULT 0 NOT NULL, CONSTRAINT name_unique UNIQUE (name))"
  );
  const statement = db.prepare(
    "INSERT INTO user ( name, password, admin ) VALUES (?,?,?);"
  );
  statement.run("admin", "admin", 1);
  statement.run("keyboardcat", "1234", 0);
  statement.run("root", "root", 0);
  statement.finalize();

  db.each("SELECT id, name, password FROM user", (err, row) => {
    console.log(row.id, row.name, row.password);
  });

  db.run(
    "CREATE TABLE diary (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL)"
  );
});

db.close();
console.log("Database populated without errors");
// process.exit(0);
