// models/ordermodel.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      title: String,
      author: String,
      price: Number
    }
  ]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
