// index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});
router.get('/failure', (req, res) => {
  res.send('Login Failed');
});

module.exports = router;
