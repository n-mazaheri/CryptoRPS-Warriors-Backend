const Games = require('../models/games');
var express = require('express');
const { ethers } = require('ethers');
var router = express.Router();
const isAuthenticated = require('../middleware/isAuthenticated');
const { findById } = require('../models/users');
const User = require('../models/users');
const { getSocketInstance, getUsers } = require('../sockets/gameSocket');

router.post('/insert-game', isAuthenticated, async (req, res) => {
  const { userId2, contractAddress } = req.body;

  const user1 = await findById(req?.user?._id?.toHexString());
  const wallet1 = user1.walletAddress;
  const user2 = await findById(userId2);
  const wallet2 = user2?.walletAddress;
  try {
    const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
    const contractABI = require('../config/contracts/RPS.json');
    const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
    console.log(contractAddress);
    let state = await contract.state();
    let winner = await contract.winner();
    let amount = await contract.stake();
    let dateTimestamp = await contract.lastAction();
    let date = new Date(Number(dateTimestamp) * 1000);
    let insertedId = await Games.insertGame(
      req?.user?._id?.toHexString(),
      userId2,
      wallet1,
      wallet2,
      date,
      contractAddress,
      amount,
      state,
      winner
    );
    const io = getSocketInstance();
    const users = getUsers();
    const toSocketId = users[userId2];

    if (toSocketId) {
      io.to(toSocketId).emit('newGame', {});
    }
    res.status(201).json({ message: 'Game added successfully' });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/update-game', isAuthenticated, async (req, res) => {
  const { contractAddress } = req.body;
  try {
    const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
    const contractABI = require('../config/contracts/RPS.json');
    const contract = new ethers.Contract(contractAddress, contractABI.abi, provider);
    let state = await contract.state();
    let winner = await contract.winner();
    let dateTimestamp = await contract.lastAction();
    let date = new Date(Number(dateTimestamp) * 1000);
    console.log({ winner, state, date });
    await Games.updateGame(contractAddress, winner, state, date);
    const io = getSocketInstance();
    const users = getUsers();
    let game = await Games.findByContractAddress(contractAddress);
    let toSocketId = users[game?.userId2];
    if (toSocketId) {
      io.to(toSocketId).emit('updateGame', {});
    }
    toSocketId = users[game?.userId1];
    if (toSocketId) {
      io.to(toSocketId).emit('updateGame', {});
    }
    res.status(201).json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/list-user-games', isAuthenticated, async (req, res) => {
  let games = await Games.userGames(req?.user?._id?.toHexString());
  let newGames = [];
  for (let game of games) {
    let newGame = { ...game };
    newGame.user1 = await User.findById(game.userId1);
    newGame.user2 = await User.findById(game.userId2);
    newGames.push(newGame);
  }

  res.json(newGames);
});

module.exports = router;
