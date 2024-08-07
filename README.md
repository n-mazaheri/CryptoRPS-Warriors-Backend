# CryptoRPS Warriors (Back-end code)

Welcome to CryptoRPS Warriors, a blockchain-based twist on the classic Rock-Paper-Scissors game with an exciting 5-move variant! In this decentralized application (dApp), players can sign up, connect their wallet addresses, and challenge others to strategic duels. Each game is managed by a smart contract, ensuring fairness and transparency. Players can engage in multiple games simultaneously, with every move and result being securely recorded on the blockchain. Whether you're a blockchain enthusiast or a casual gamer, CryptoRPS Warriors offers a unique blend of strategy and technology. Join the battle, deploy your moves, and prove your prowess in this innovative and secure gaming arena!

You can find front-end part of code in this repository [here](https://github.com/n-mazaheri/CryptoRPS-Warriors)

# Project Description

CryptoRPS Warriors is a blockchain-based twist on the classic Rock-Paper-Scissors game, featuring an exciting 5-move variant. This repository have its back-end code that is responsible for managment of users and wallets authentication and authorization. It also keeps track of games that users already deployed on blockchain and update them based on user moves. After creation of each new game or a new movement in exisiting games, it will send socket events to users.

## Technologies Used

- Express.js
- Blockchain Libraries: Etherjs
- User authenticaton: Passport
- Event management: Socket.io, socket.io-client
- Databse: MongoDB

## How To Use

To set up the project, follow these steps:

1. Clone the repository: `git clone https://github.com/n-mazaheri/CryptoRPS-Warriors-Backend`
2. Navigate to the project directory: `cd CryptoRPS-Warriors-Backend`
3. Install dependencies: `npm install`
4. add a .env file to the project with DATABASE_URL="...."
5. Start the project: `npm start`
