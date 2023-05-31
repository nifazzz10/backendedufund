const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  category: String,
  price: Number,
  publisher: String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;