const DB = require('../config/db');

module.exports = {
  findById: async (id) => {
    const db = await DB.connectToDatabase();
    const users = db.collection('users');
    let user = await users.findOne({ _id: new DB.ObjectId(id) });
    return user;
  },
  findByUsername: async (username) => {
    const db = await DB.connectToDatabase();
    const users = db.collection('users');
    let user = await users.findOne({ username });
    return user;
  },
  findByWalletAddress: async (walletAddress) => {
    const db = await DB.connectToDatabase();
    const users = db.collection('users');
    let user = await users.findOne({ walletAddress });
    return user;
  },
  addUser: async (username, passwordHash, salt, avatar) => {
    const db = await DB.connectToDatabase();
    const users = db.collection('users');
    let { insertedId } = await users.insertOne({ username, passwordHash, salt, avatar });
    let user = await users.findOne({ _id: insertedId });
    return user;
  },
  listUsers: async () => {
    const db = await DB.connectToDatabase();
    const users = db.collection('users');
    let res = await users.find({}).toArray();
    return res;
  },

  saveNonce: async (nonce, walletaddress) => {
    const db = await DB.connectToDatabase();
    const nonces = db.collection('nonces');
    await nonces.insertOne({ nonce, walletaddress });
  },

  findNonce: async (nonce, walletaddress) => {
    const db = await DB.connectToDatabase();
    const nonces = db.collection('nonces');
    let nonceDoc = await nonces.findOne({ nonce, walletaddress });
    return nonceDoc;
  },

  updateUserWallet: async (id, walletAddress) => {
    const db = await DB.connectToDatabase();
    const users = db.collection('users');
    await users.updateOne({ _id: new DB.ObjectId(id) }, { $set: { walletAddress } });
  },
};
