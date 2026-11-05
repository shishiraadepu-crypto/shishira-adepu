const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

async function openDatabase() {
    const db = await sqlite.open({
        filename: path.join(__dirname, "database.db"),
        driver: sqlite3.Database
    });

    console.log("SQLite database connected successfully!");

    return db;
}

module.exports = openDatabase;