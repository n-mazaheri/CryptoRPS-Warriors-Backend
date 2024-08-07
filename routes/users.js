var express = require('express');
var router = express.Router();
const passport = require('../config/passport');
const User = require('../models/users');
const Utils = require('../config/utils');
const isAuthenticated = require('../middleware/isAuthenticated');
const fs = require('fs');
const path = require('path');
const { getUsers } = require('../sockets/gameSocket');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json({ user });
    });
  })(req, res, next);
});

router.post('/signup', async (req, res) => {
  const { username, password, avatar } = req.body;
  let salt = await Utils.generateSalt();
  let passwordHash = await Utils.hashPassword(password, salt);
  try {
    let user = await User.addUser(username, passwordHash, salt, avatar);
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal Server Error', user: null });
  }
});

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.status(201).json({ message: 'log out successfully' });
  });
});

router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ user: req.user });
  } else {
    res.status(401).send({ user: null });
  }
});
router.get('/avatars', (req, res) => {
  //res.send({ user: req.user });
  const imagesDir = path.join('', 'public/avatars');

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Unable to scan directory');
    }

    const images = files.filter((file) => {
      return file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif');
    });

    res.json(images);
  });
});

router.get('/list-active', (req, res) => {
  let activeUsers = getUsers();
  res.json(Object.keys(activeUsers));
});
router.get('/list', async (req, res) => {
  let list = await User.listUsers();
  list.filter((l) => {
    l.avatar, l.username, l.walletAddress;
  });
  res.json(list);
});

router.post('/generate-nonce', isAuthenticated, async (req, res) => {
  const { walletAddress } = req.body;
  const nonce = Utils.generateNonce();
  await User.saveNonce(nonce, walletAddress);
  res.json({ nonce });
});

router.post('/verify-signature', isAuthenticated, async (req, res) => {
  const { nonce, signature, walletAddress } = req.body;

  let nonceDoc = await User.findNonce(nonce, walletAddress);
  if (!nonceDoc) return res.status(400).send({ message: 'Signature verification failed.', isValid: false });
  const isValid = Utils.verifySignature(nonce, signature, walletAddress);
  if (isValid) {
    // const anotherUser = await User.findByWalletAddress(walletAddress);
    // if (!anotherUser || anotherUser._id.toHexString() !== req?.user?._id?.toHexString()) {
    await User.updateUserWallet(req?.user?._id?.toHexString(), walletAddress);
    return res.status(200).json({ message: 'Signature verified. Wallet address added successfully.', isValid: true });
    //} else {
    //  return res.status(400).json({ message: 'This wallet address used by another user', isValid: false });
    // }
  } else {
    return res.status(400).json({ message: 'Signature verification failed.', isValid: false });
  }
});

module.exports = router;
