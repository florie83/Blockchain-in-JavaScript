# Blockchain-in-JavaScript
A Modular Blockchain Node and Wallet Implementation in JavaScript.

## Features
* Multiple local and remote **Nodes** can be linked in the network.
* Websockets allow communication between Nodes.
* Decryption of Signatures to check the **authenticity** of Transactions.
* Maintanence of **Transaction Pools** for each node.
* **Mining** of Transactions from the Pool into Blocks.
* **Transmission** of Blocks between Nodes.
* **Proof of Work** implementation with **Difficulty** adjusting algorithm.
* **Conflict Resolution** between nodes by Hash Power.
* **Wallet implemetation** and **Balance calculation** based on UTXOs.

## Setup
Requires a Windows environment and npm (https://www.npmjs.com/).

Download the dependencies and start the server with - 
```
npm install
npm run dev
```
By default, this will run on HTTP_PORT=3001 and listen on port 5001.

To spin up a new node, for instance, from another terminal - 
```
env:HTTP_PORT="3002"
env:P2P_PORT="5002"
env:PEERS="ws://127.0.0.1;5001"
npm run dev
```
To run multiple nodes just change the port values and add new peers.

## Endpoints to interact with the network

* `/get-publickey` : (GET)\
   Returns your Public-Key.
* `/mine-transactions` : (GET)\
   Mine Transactions into the next Block.
* `/get-transactions` : (GET)\
   Returns Transactions present in the Transaction Pool.
* `/get-blocks` : (GET)\
   Returns all the Blocks in the Blockchain.
* `/get-balance` : (GET)\
   Get the Wallet Balance.
* `/transact` : (POST(-{recipient:"",amount:""}))\
   Post a Transaction.
