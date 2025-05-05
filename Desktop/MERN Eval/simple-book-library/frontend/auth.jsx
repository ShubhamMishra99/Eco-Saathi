import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const books = [];
app.use(cors());
app.use(express.static('public'));

const app = express();
app.use(bodyParser.json());

app.post('/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    publicationYear: parseInt(req.body.publicationYear),
  };

  books.push(newBook);
  res.status(201).json(newBook);
});
   
app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

app.put('/books/:id', (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  book.title = req.body.title;
  book.author = req.body.author;
  book.publicationYear = parseInt(req.body.publicationYear);

  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

