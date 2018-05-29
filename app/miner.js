const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner{

	constructor(blockchain,transactionPool,wallet,p2pServer){//each miner will have these
		this.blockchain = blockchain;
		this.transactionPool = transactionPool;
		this.wallet = wallet;
		this.p2pServer = p2pServer;
	}

	mine(){
		const validTransactions = this.transactionPool.validTransactions();
 		//include the reward transaction in the pool of valid transactions
 		validTransactions.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()));
 		//create a block containing these transactions
 		const block = this.blockchain.addBlock(validTransactions);
 		//sync the chains
 		this.p2pServer.syncChain();
 		//clear the transaction pool
 		this.transactionPool.clear();
 		//sync the call to clear the transactions
 		this.p2pServer.broadcastClearTransactions();
 		return block;


 	}
}

module.exports = Miner;