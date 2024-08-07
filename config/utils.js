const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { ethers } = require('ethers');

async function generateSalt() {
  const saltRounds = 10; // Number of salt rounds
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return salt;
  } catch (error) {
    console.error('Error generating salt:', error);
    throw error;
  }
}

async function hashPassword(password, salt) {
  try {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

function verifySignature(nonce, signature, walletAddress) {
  const recoveredAddress = ethers.verifyMessage(nonce, signature);
  return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
}

module.exports = {
  hashPassword,
  generateSalt,
  generateNonce,
  verifySignature,
};
