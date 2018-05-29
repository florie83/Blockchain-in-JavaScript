const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');//every user will have its own wallet.
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;//gives the users the ability to overwrite the variable and use another another port

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pServer);

app.use(bodyParser.json());//this allows us to receive json in post requests

app.get('/blocks',(req,res) => {
	res.json(bc.chain);
});

app.post('/mine',(req,res) => {
	const block = bc.addBlock(req.body.data);//body being the object and accessing data as accessing a key in dictionary because the post will contain a 'data key'
	console.log(`New block added: ${block.toString()}`);

	p2pServer.syncChain();

	res.redirect('/blocks');//redirect it to localhost:3001/blocks to get a full chain with the new block added
});

app.get('/get-transactions',(req,res) => {
	res.json(tp.transactions);
});

app.post('/transact',(req,res) => {
	const {recipient,amount} = req.body;
	const transaction = wallet.createTransaction(recipient,amount,bc,tp);
	p2pServer.broadcastTransaction(transaction);
	res.redirect('/transactions');
});

app.get('/get-publickey',(req,res) => {
	res.json({publicKey:wallet.publicKey});
});

app.get('/mine-transactions',(req,res) => {
	const block = miner.mine();
	console.log(`New block added ${block.toString()}`);
	res.redirect('/blocks');
});

app.get('/get-balance',(req,res) => {
	res.json({walbalance:wallet.calculateBalance(bc)});
});

app.listen(HTTP_PORT,() => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();//Listen is a function in p2p-server.js.
