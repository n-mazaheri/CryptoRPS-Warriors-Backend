# CryptoRPS Warriors

Welcome to CryptoRPS Warriors, a blockchain-based twist on the classic Rock-Paper-Scissors game with an exciting 5-move variant! In this decentralized application (dApp), players can sign up, connect their wallet addresses, and challenge others to strategic duels. Each game is managed by a smart contract, ensuring fairness and transparency. Players can engage in multiple games simultaneously, with every move and result being securely recorded on the blockchain. Whether you're a blockchain enthusiast or a casual gamer, CryptoRPS Warriors offers a unique blend of strategy and technology. Join the battle, deploy your moves, and prove your prowess in this innovative and secure gaming arena!

# project description

CryptoRPS Warriors is a blockchain-based twist on the classic Rock-Paper-Scissors game, featuring an exciting 5-move variant. This repository have its back-end code that is responsible for managment of users and wallets authentication and authorization. It also keeps track of games that users already deployed on blockchain and update them based on user moves. After creation of each new game or a new movement in exisiting games, it will send socket events to users.

## Technologies Used

- Express.js
- Blockchain Libraries: Etherjs
- User authenticaton: Passport
- Event management: Socket.io, socket.io-client
- Databse: MongoDB
