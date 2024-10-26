const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    const getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
    getBooks.then(() => console.log("Promise for Task 10 resolved!"));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    resolve(res.send(books[isbn]));
  });
  getBook.then(() => console.log("Promise for Task 11 resolved!"));  
 });
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthorPromise = new Promise((resolve, reject) => {
        const booksByAuthor = Object.values(books).filter(book => book.author === author);
        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found for this author");
        }
    });

    booksByAuthorPromise
        .then(data => {
            console.log("Promise for Task 12 resolved!");
            res.send(data);
        });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitlePromise = new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);
      if (booksByTitle.length > 0) {
          resolve(booksByTitle);
      } else {
          reject("No books found for this title");
      }
    });
    booksByTitlePromise
      .then(data => {
          console.log("Promise for Task 13 resolved!");
          res.send(data);
      });
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
   const getReviewByISBN = (index) => books[index].reviews;
   return res.send(getReviewByISBN(isbn));
});

module.exports.general = public_users;
