const express = require("express");
const openDatabase = require("./db");

const app = express();
app.use(express.json());

let db;

// Initialize database and start server
const initializeDBAndServer = async () => {
    try {
        db = await openDatabase();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.log(`Database Error: ${error.message}`);
        process.exit(1);
    }
};
// ==========================================
// 1. GET ALL BOOKS
// Search, sorting, filtering and pagination
// ==========================================

app.get("/books/", async (request, response) => {
    try {
        const {
            search_q = "",
            order_by = "id",
            order = "ASC",
            limit = 10,
            offset = 0,
            min_price,
            max_price
        } = request.query;

        const allowedColumns = ["id", "title", "author", "price", "pages"];

        if (!allowedColumns.includes(order_by)) {
            return response.status(400).json({
                message: "Invalid order_by column"
            });
        }

        if (!["ASC", "DESC"].includes(order.toUpperCase())) {
            return response.status(400).json({
                message: "Order must be ASC or DESC"
            });
        }

        const parsedLimit = Number(limit);
        const parsedOffset = Number(offset);

        if (
            !Number.isInteger(parsedLimit) ||
            !Number.isInteger(parsedOffset) ||
            parsedLimit <= 0 ||
            parsedOffset < 0
        ) {
            return response.status(400).json({
                message: "Limit must be positive and offset must be non-negative integers"
            });
        }

        let query = `
            SELECT *
            FROM book
            WHERE title LIKE ?
        `;

        const params = [`%${search_q}%`];

        if (min_price !== undefined) {
            const minimum = Number(min_price);

            if (!Number.isFinite(minimum)) {
                return response.status(400).json({
                    message: "min_price must be a valid number"
                });
            }

            query += " AND price >= ?";
            params.push(minimum);
        }

        if (max_price !== undefined) {
            const maximum = Number(max_price);

            if (!Number.isFinite(maximum)) {
                return response.status(400).json({
                    message: "max_price must be a valid number"
                });
            }

            query += " AND price <= ?";
            params.push(maximum);
        }

        query += ` ORDER BY ${order_by} ${order.toUpperCase()} LIMIT ? OFFSET ?`;

        params.push(parsedLimit, parsedOffset);

        const books = await db.all(query, params);

        response.status(200).json(books);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 2. GET BOOK BY ID
// ==========================================

app.get("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const book = await db.get(
            `SELECT * FROM book WHERE id = ?`,
            [bookId]
        );

        if (!book) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        response.status(200).json(book);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// 3. POST A NEW BOOK
// With input validation
// ==========================================

app.post("/books/", async (request, response) => {
    try {
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== "string" ||
            title.trim() === "" ||
            typeof author !== "string" ||
            author.trim() === "" ||
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price))
        ) {
            return response.status(400).json({
                message: "Title, author and a valid numeric price are required"
            });
        }

        const insertQuery = `
            INSERT INTO book (title, author, price, pages)
            VALUES (?, ?, ?, ?)
        `;

        const result = await db.run(insertQuery, [
            title.trim(),
            author.trim(),
            Number(price),
            pages || null
        ]);

        response.status(201).json({
            message: "Book added successfully",
            bookId: result.lastID
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

// ==========================================
// 4. PUT - UPDATE AN EXISTING BOOK
// ==========================================

app.put("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;
        const { title, author, price, pages } = request.body;

        // Validate input
        if (
            typeof title !== "string" ||
            title.trim() === "" ||
            typeof author !== "string" ||
            author.trim() === "" ||
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price))
        ) {
            return response.status(400).json({
                message: "Title, author and a valid numeric price are required"
            });
        }

        // Check whether the book exists
        const existingBook = await db.get(
            "SELECT * FROM book WHERE id = ?",
            [bookId]
        );

        if (!existingBook) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        // Update book details
        await db.run(
            `UPDATE book
             SET title = ?, author = ?, price = ?, pages = ?
             WHERE id = ?`,
            [title.trim(), author.trim(), Number(price), pages || null, bookId]
        );

        response.status(200).json({
            message: "Book updated successfully"
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

// ==========================================
// 5. DELETE - REMOVE A BOOK
// ==========================================

app.delete("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        // Check whether the book exists
        const existingBook = await db.get(
            "SELECT * FROM book WHERE id = ?",
            [bookId]
        );

        if (!existingBook) {
            return response.status(404).json({
                message: "Book not found"
            });
        }

        // Delete the book
        await db.run(
            "DELETE FROM book WHERE id = ?",
            [bookId]
        );

        response.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});
// ==========================================
// START SERVER
// ==========================================

initializeDBAndServer();
