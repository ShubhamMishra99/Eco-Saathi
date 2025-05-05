const express = require('express');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let books = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', publicationYear: 1960,genre: 'fiction' },
  { id: 2, title: '1984', author: 'George Orwell', publicationYear: 1949 , genre: 'fiction'  },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publicationYear:
    1925, genre: 'fiction' },
    { id: 4, title: 'The Catcher in the Rye', author: 'J.D. Salinger', publicationYear: 1951, genre: 'fiction' },
    { id: 5, title: 'Pride and Prejudice', author: 'Jane Austen', publicationYear: 1813, genre: 'fiction' },
];

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});
  
app.post('/books', (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    publicationYear: parseInt(req.body.publicationYear),
  };

  books.push(book);
  res.status(201).json(book);
});