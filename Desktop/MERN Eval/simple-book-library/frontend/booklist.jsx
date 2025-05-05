import React, { useState } from 'react';

function BookList({ books, onDelete, onUpdate }) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (book) => {
    setEditId(book.id);
    setEditData(book);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(editId, editData);
    setEditId(null);
  };

  return (
    <div className="book-list">
      {books.map(book => (
        <div key={book.id} className="book-item">
          {editId === book.id ? (
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editData.title}
                onChange={e => setEditData({ ...editData, title: e.target.value })}
                placeholder="Title"
                required
              />
              <input
                type="text"
                value={editData.author}
                onChange={e => setEditData({ ...editData, author: e.target.value })}
                placeholder="Author"
                required
              />
              <input
                type="text"
                value={editData.year}
                onChange={e => setEditData({...editData, genre: e.target.value })}
                placeholder="Genre"
                required
              />
              <input
                type="number"
                value={editData.year}
                onChange={e => setEditData({ ...editData, year: e.target.value })}
                placeholder="Year"
                required
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditId(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <h3>{book.title}</h3>
              <p>Author: {book.author}</p>
              <p>Year: {book.year}</p>
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button onClick={() => onDelete(book.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default BookList;