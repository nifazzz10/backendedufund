const books = [
    { title: 'Beauty And Beast', author: 'Charles Darwin', category: 'fiction', price: 14, publisher: 'lokesh' },
    { title: 'The Gen', author: 'Richard Dawkins', category: 'fiction', price: 12, publisher: 'kanagraj' },
    { title: 'Suicide Squad', author: 'Stephen Hawking', category: 'fiction', price: 10, publisher: 'deva' },
    { title: "Big Bang", author: 'Richard Dawkins', category: 'mystery', price: 15, publisher: 'vijay ' },
    { title: 'The Watchman', author: 'Richard Dawkins', category: 'mystery', price: 13, publisher: 'giant publication' },
    { title: 'The Matrix', author: 'Brian Greene', category: 'mystery', price: 16, publisher: 'Edu fund' },
    { title: 'The Demon-Slayer', author: 'Carl Sagan', category: 'mystery', price: 11, publisher:"Edu fund"}
    // add more books here
  ];
  const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://nifaz:Fb5UhL4TCP8mLOsg@cluster0.sdiy1fl.mongodb.net';

async function insertBooks() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db('test');
  const collection = db.collection('books');

  // insert the books into the database
  await collection.insertMany(books);

  client.close();
}

insertBooks();