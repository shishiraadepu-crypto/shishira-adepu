const openDatabase = require("./db");

const verifyDatabase = async () => {
    try {
        const db = await openDatabase();

        const books = await db.all("SELECT * FROM book");

        console.table(books);

        console.log("Total books:", books.length);

        await db.close();
    } catch (error) {
        console.log("Database verification error:", error.message);
    }
};

verifyDatabase();