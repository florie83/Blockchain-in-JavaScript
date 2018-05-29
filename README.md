# Blockchain-in-JavaScript
A Modular Blockchain Node and Wallet Implementation in JavaScript.

## Features
* Multiple local and remote nodes can be linked in the network.
* Websockets allow communication between nodes.
* Decryption of signatures to check the authenticity of transactions.
* Maintanence of transaction pools for each node.
* Mining of transactions from the pool into blocks.
* Transmission of blocks between nodes.
* Proof of work implementation with difficulty adjusting algorithm.
* Conflict resolution between nodes by hash power
* Wallet implemetation and Balance calculation based on UTXO

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
