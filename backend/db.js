const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "mydatabase.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS Cities (
            uuid TEXT PRIMARY KEY,
            cityName TEXT,
            count INTEGER
        )`, (err) => {
      if (err) {
        console.error("Table creation error:", err.message);
      } else {
        console.log("Cities table ready");
      }
    });
  }
});

module.exports = db;
