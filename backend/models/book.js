const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book: String,
});
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;