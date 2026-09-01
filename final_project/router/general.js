const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Promise helpers for Tasks 10-13
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
};

const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    const matching = [];
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        matching.push({isbn: key, ...books[key]});
      }
    });
    if (matching.length > 0) {
      resolve(matching);
    } else {
      reject(new Error("No books found for this author"));
    }
  });
};

const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    const matching = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        matching.push({isbn: key, ...books[key]});
      }
    });
    if (matching.length > 0) {
      resolve(matching);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
};

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list using async-await
public_users.get('/', async function (req, res) {
    try {
      const allBooks = await getAllBooks();
      return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
      return res.status(500).json({message: error.message});
    }
  });

// Task 11: Get book by ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const book = await getBookByISBN(req.params.isbn);
      return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
      return res.status(404).json({message: error.message});
    }
  });


// Task 12: Get books by author using async-await
public_users.get('/author/:author', async function (req, res) {
    try {
      const matching = await getBooksByAuthor(req.params.author);
      return res.status(200).send(JSON.stringify(matching, null, 4));
    } catch (error) {
      return res.status(404).json({message: error.message});
    }
  });


// Task 13: Get books by title using async-await
public_users.get('/title/:title', async function (req, res) {
    try {
      const matching = await getBooksByTitle(req.params.title);
      return res.status(200).send(JSON.stringify(matching, null, 4));
    } catch (error) {
      return res.status(404).json({message: error.message});
    }
  });

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;