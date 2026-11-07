# Lab 3 – REST API, Query Parameters, Validation and Debugging

## Student Details

- **Name:** Shishira Adepu
- **Course:** Backend Development Fundamentals
- **Year:** II
- **Term:** II
- **Section:** BTECH-CSE-2A (223)
- **Institution:** Aurora

## Live Deployment

**Platform:** Render

**Live API URL:**  
https://lab-03-rest-api-6l0o.onrender.com/books/

**Deployment Status:** Successfully Deployed

## 1. Objective

To develop a RESTful API using Node.js, Express.js and SQLite by implementing search, sorting, filtering, pagination, input validation and proper HTTP status codes. This lab extends the CRUD operations developed in Lab 2.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- sqlite
- sqlite3
- Postman
- Visual Studio Code

## 3. Project Structure

```text
lab-03/
│
├── screenshots/
│   ├── get-all-books.png
│   ├── get-book-by-id.png
│   ├── get-book-not-found.png
│   ├── post-book-success.png
│   ├── post-book-validation.png
│   ├── put-book-success.png
│   ├── put-book-not-found.png
│   ├── delete-book-success.png
│   ├── delete-book-not-found.png
│   └── database-verification.png
│
├── database.db
├── db.js
├── server.js
├── verify-db.js
├── package.json
└── package-lock.json
```

## 4. Database Details

**Database Name:** database.db  
**Table Name:** book

The book table contains the following columns:

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| title | TEXT | Book title |
| author | TEXT | Author name |
| price | INTEGER | Book price |
| pages | INTEGER | Number of pages |

## 5. API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Retrieve all books |
| GET | `/books/:bookId/` | Retrieve a book by ID |
| POST | `/books/` | Add a new book |
| PUT | `/books/:bookId/` | Update an existing book |
| DELETE | `/books/:bookId/` | Delete a book |

## 6. Query Parameters

The GET `/books/` endpoint supports:

| Parameter | Description | Example |
|---|---|---|
| search_q | Search books by partial title | `?search_q=Atomic` |
| order_by | Select sorting column | `?order_by=price` |
| order | Ascending or descending order | `?order=DESC` |
| limit | Maximum number of records | `?limit=5` |
| offset | Number of records to skip | `?offset=5` |
| min_price | Minimum book price | `?min_price=200` |
| max_price | Maximum book price | `?max_price=400` |

### Example Requests

Search:
```text
GET /books/?search_q=Atomic
```

Sort by price:
```text
GET /books/?order_by=price&order=DESC
```

Filter by price:
```text
GET /books/?min_price=200&max_price=400
```

Pagination:
```text
GET /books/?limit=5&offset=0
```

## 7. Input Validation

The POST and PUT routes validate the required book details.

- Title must be provided and cannot be empty.
- Author must be provided and cannot be empty.
- Price must be a valid numeric value.
- Invalid input returns HTTP 400 with a JSON error message.

## 8. HTTP Status Codes

| Status Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful GET, PUT and DELETE |
| 201 | Created | Book successfully added |
| 400 | Bad Request | Invalid input |
| 404 | Not Found | Book ID does not exist |
| 500 | Internal Server Error | Server-side error |

## 9. SQL Injection Prevention

Parameterized SQL queries with `?` placeholders are used to safely pass user-provided values into database queries.

Sorting columns are restricted to an allowed list, and sorting order is validated before being included in the SQL query.

This helps prevent SQL injection attacks.

## 10. Running the Project

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Start the server

```bash
node server.js
```

### Step 3: Open the API

```text
http://localhost:3000/books/
```

The server connects to the SQLite database before accepting requests.

## 11. Testing

The API routes were tested using Postman.

The testing activities include:

1. Retrieve all books.
2. Retrieve a book using its ID.
3. Test an invalid book ID.
4. Add a new book.
5. Validate missing or invalid input.
6. Update an existing book.
7. Test updating a non-existing book.
8. Delete an existing book.
9. Test deleting a non-existing book.
10. Verify database records using SQLite.

## 12. Database Verification

The database was verified using the Node.js SQLite package with the following command:

```bash
node verify-db.js
```

The verification displayed the book records and confirmed that the database contained 10 records after the testing operations.

## 13. Screenshots

The `screenshots` folder contains Postman request and response evidence, validation results, and database verification output.

## 14. Learning Outcomes

Through this lab, I learned:

- REST API design using Express.js.
- Query parameters for searching, sorting, filtering and pagination.
- Input validation and error handling.
- Correct use of HTTP status codes.
- Parameterized SQL queries.
- Debugging common backend development errors.
- Testing REST API endpoints using Postman.
- Verifying database changes using SQLite.

## 15. Conclusion

This lab helped me extend basic CRUD operations into a more structured REST API. I implemented query parameters, input validation, proper HTTP status codes and SQL injection prevention techniques using Express.js and SQLite.
