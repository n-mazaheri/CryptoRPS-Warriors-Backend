const DB = require('../config/db');

module.exports = {
  findByContractAddress: async (contractAddress) => {
    const db = await DB.connectToDatabase();
    const games = db.collection('games');
    const userGames = await games.findOne({ contractAddress });
    return userGames;
  },
  userGames: async (userId) => {
    const db = await DB.connectToDatabase();
    const games = db.collection('games');
    const userGames = await games.find({ $or: [{ userId1: userId }, { userId2: userId }] }).toArray();
    return userGames;
  },
  updateGameState: async (contractAddress, state) => {
    const db = await DB.connectToDatabase();
    const games = db.collection('games');
    await games.updateOne({ contractAddress }, { $set: { state } });
  },
  updateGameWinner: async (contractAddress, winner) => {
    const db = await DB.connectToDatabase();
    const games = db.collection('games');
    await games.updateOne({ contractAddress }, { $set: { winner } });
  },
  updateGame: async (contractAddress, winner, state, date) => {
    const db = await DB.connectToDatabase();
    const games = db.collection('games');
    await games.updateOne({ contractAddress }, { $set: { winner, state, date } });
  },
  insertGame: async (userId1, userId2, wallet1, wallet2, date, contractAddress, amount, state = 1, winner = -1) => {
    const db = await DB.connectToDatabase();
    const games = db.collection('games');
    let game = await games.findOne({ contractAddress });
    if (!game) {
      let res = await games.insertOne({
        userId1,
        userId2,
        wallet1,
        wallet2,
        date,
        contractAddress,
        amount,
        state,
        winner,
      });
    } else {
      await games.updateOne(
        { contractAddress },
        {
          $set: {
            state,
            winner,
          },
        }
      );
    }
  },
};
