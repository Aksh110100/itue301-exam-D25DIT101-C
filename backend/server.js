const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");
const Member = require("./models/Member");
const Borrowing = require("./models/Borrowing");

const app = express();
const PORT = process.env.PORT || 5000;

const books = [
  {
    id: "book-1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    isbn: "9780743273565",
    available: true,
  },
  {
    id: "book-2",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    isbn: "9780132350884",
    available: false,
  },
];

const borrowings = [];

function requestLogger(req, res, next) {
  console.log(`[${req.method}] ${req.path} [${new Date().toISOString()}]`);
  next();
}

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/api/v1/borrowings", (req, res) => {
  res.status(200).json(borrowings);
});

app.post("/api/v1/borrowings", (req, res, next) => {
  try {
    const { memberId, bookId, borrowDate, returnDate, status } = req.body;

    if (!memberId || !bookId || !borrowDate || !returnDate || !status) {
      return res.status(400).json({
        error: "ValidationError",
        message:
          "memberId, bookId, borrowDate, returnDate, and status are required",
      });
    }

    if (!["borrowed", "returned", "overdue"].includes(status)) {
      return res.status(400).json({
        error: "ValidationError",
        message: "status must be borrowed, returned, or overdue",
      });
    }

    const borrowing = {
      id: `borrowing-${borrowings.length + 1}`,
      memberId,
      bookId,
      borrowDate,
      returnDate,
      status,
    };

    borrowings.push(borrowing);
    return res.status(201).json(borrowing);
  } catch (error) {
    return next(error);
  }
});

app.get("/api/v1/books", (req, res) => {
  res.status(200).json(books);
});

app.get("/api/v1/mongo/books", async (req, res, next) => {
  try {
    const savedBooks = await Book.find();
    res.status(200).json(savedBooks);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/mongo/books", async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/mongo/members", async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/mongo/borrowings", async (req, res, next) => {
  try {
    const savedBorrowings = await Borrowing.find()
      .populate("memberId", "name email")
      .populate("bookId", "title author");
    res.status(200).json(savedBorrowings);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/mongo/borrowings", async (req, res, next) => {
  try {
    const borrowing = await Borrowing.create(req.body);
    res.status(201).json(borrowing);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/mongo/borrowings/from-form", async (req, res, next) => {
  try {
    const { memberName, bookTitle, borrowDate, returnDate } = req.body;

    if (!memberName || !bookTitle || !borrowDate || !returnDate) {
      return res.status(400).json({
        error: "ValidationError",
        message:
          "memberName, bookTitle, borrowDate, and returnDate are required",
      });
    }

    const book = await Book.findOne({ title: bookTitle });
    if (!book) {
      return res.status(404).json({
        error: "NotFound",
        message: "The selected book was not found in MongoDB",
      });
    }

    const memberEmail = `${memberName.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@library.local`;
    const member = await Member.findOneAndUpdate(
      { email: memberEmail },
      {
        name: memberName,
        email: memberEmail,
        department: "Library",
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    const borrowing = await Borrowing.create({
      memberId: member._id,
      bookId: book._id,
      borrowDate,
      returnDate,
    });

    res.status(201).json(borrowing);
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Library backend is running" });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "ValidationError",
      message: "The submitted data is invalid",
      fields: Object.values(error.errors).map((fieldError) => ({
        field: fieldError.path,
        message: fieldError.message,
      })),
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      error: "DuplicateValue",
      message: "A record with this unique value already exists",
    });
  }

  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred",
  });
});

async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
