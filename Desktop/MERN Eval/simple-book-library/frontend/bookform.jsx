import React, { useState } from 'react';

function BookForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', author: '', year: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <input
        type="text"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        placeholder="Book Title"
        required
      />
      <input
        type="text"
        value={formData.author}
        onChange={e => setFormData({ ...formData, author: e.target.value })}
        placeholder="Author"
        required
      />
        <input
            type="text"
            value={formData.genre}
            onChange={e => setFormData({ ...formData, genre: e.target.value })}
            placeholder="Genre"
            required
        />
      <input
        type="number"
        value={formData.year}
        onChange={e => setFormData({ ...formData, year: e.target.value })}
        placeholder="Publication Year"
        required
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;