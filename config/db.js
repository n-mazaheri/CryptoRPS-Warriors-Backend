const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://namazaheri:166846877@cluster0.frg1sj3.mongodb.net/srp';

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
