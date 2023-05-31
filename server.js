const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/usermodel');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// connect to MongoDB
mongoose.connect('mongodb+srv://nifaz:Fb5UhL4TCP8mLOsg@cluster0.sdiy1fl.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

const Book = require('./models/bookmodel'); // import your Book model

app.get('/books', async (req, res) => {
  // get the query parameters
  const category = req.query.category;
  const filter = req.query.filter;

  // build the query
  let query = {};
  if (category && category !== 'all') {
    query.category = category;
  }
  if (filter) {
    query.$or = [
      { title: { $regex: filter, $options: 'i' } },
      { author: { $regex: filter, $options: 'i' } }
    ];
  }

  // find the books
  const books = await Book.find(query).select('title author category price publisher');


  // send the response
  res.json({ books });
});

// app.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     // check if the email already exists in the database
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }
//     // hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // create a new user and store it in the database
//     const newUser = new User({ email, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: 'User created' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // create a new user and store it in the database
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // compare the provided password with the stored password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // if successful, create a session for the user
    // and redirect to the user's profile page
    res.status(200).json({ message: 'Logged in' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


  
  const stripe = require('stripe')('sk_test_51NDls2SJYorgBX6jvsm08CY6JZcVFMIBKwxftomrD4ySztrSBzm9OE2d8DhT9cP5v0ZiK2OQqnyUAaFnxtZfwZxv00DzqbbjF7'); // replace with your own secret key

  
  
//   app.post('/create-checkout-session', async (req, res) => {
//     const { cartItems } = req.body;
  
//     // create an array of line items for the checkout session
//     const lineItems = cartItems.map(item => ({
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: item.title
//         },
//         unit_amount: item.price * 100 // convert to cents
//       },
//       quantity: 1
//     }));
  
//     // create the checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel'
//     });
  
//     // return the session ID
//     res.json({ sessionId: session.id });
//   });

app.post('/create-checkout-session', async (req, res) => {
    const { cartItems } = req.body;
  
    // create an array of line items for the checkout session
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title
        },
        unit_amount: item.price * 100 // convert to cents
      },
      quantity: 1
    }));
  
    // create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    });
  
    // return the session ID
    res.json({ sessionId: session.id });
  });
  
  app.post('/orders', async (req, res) => {
    try {
      const { userId, items } = req.body;
  
      // Create a new order and save it in the database
      const order = new Order({ userId, items });
      await order.save();
  
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  app.get('/profile', async (req, res) => {
    try {
      // Retrieve the user's profile and order history
      const userId = req.query.userId; // Assuming you pass the userId as a query parameter
      const user = await User.findById(userId).populate('orderHistory');
      
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Extract the relevant data from the user object
      const profile = {
        _id: user._id,
        email: user.email,
        orderHistory: user.orderHistory
      };
      
      // Send the profile data as the response
      res.json({ profile });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  const Order = require('./models/ordermodel');

  // ...

//   app.post('/orders', async (req, res) => {
//     try {
//       const { userId, items } = req.body;
  
//       // Create a new order and save it in the database
//       const order = new Order({ userId, items });
//       await order.save();
  
//       res.status(201).json(order);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  
app.listen(3002, () => console.log('Server started on port 3002'));