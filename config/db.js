const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.DATABASE_URL;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    return client.db();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = { connectToDatabase, ObjectId };
