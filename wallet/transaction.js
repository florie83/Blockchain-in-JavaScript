const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');

class Transaction{
	constructor(){
		this.id = ChainUtil.id();
		this.input = null;
		this.outputs = [];
	}

	update(senderWallet,recipient,amount){
		const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);//this accesses both the address and the amount
	
		if(amount > senderOutput.amount){
			console.log(`Amount: ${amount} exceeds balance`);
			return;
		}

		senderOutput.amount = senderOutput.amount - amount;
		this.outputs.push({amount,address:recipient});//pushes the new transaction details to the array

		Transaction.signTransaction(this,senderWallet);

		return this;
	}

	static transactionWithOutputs(senderWallet,outputs){//we create this helper function because the reward transaction contains only one output.
		const transaction = new this();
		transaction.outputs.push(...outputs);
		Transaction.signTransaction(transaction,senderWallet);
		return transaction;
	}

	static newTransaction(senderWallet,recipient,amount){

		if(amount > senderWallet.balance){
			console.log(`Amount: ${amount} exceeds balance.`);
			return;
		}

		/*const transaction = new this();//this refers to the gicen class;

		transaction.outputs.push(...[
			{amount:senderWallet.balance-amount,address:senderWallet.publicKey},
			{amount,address:recipient}//In ES6,if the value and the key are the same,they can be handled in this way,so this actually is the same as amount:amount.
		]);
		Transaction.signTransaction(transaction,senderWallet);

		return  transaction;*/

		return Transaction.transactionWithOutputs(senderWallet,[{amount:senderWallet.balance-amount,address:senderWallet.publicKey},
			{amount,address:recipient}]);
	}

	static rewardTransaction(minerWallet,blockchainWallet){
		return Transaction.transactionWithOutputs(blockchainWallet,[
			{amount:MINING_REWARD,address:minerWallet.publicKey}]);
	}

	static signTransaction(transaction,senderWallet){
		transaction.input = {
			timestamp : Date.now(),
			amount : senderWallet.balance,
			address : senderWallet.publicKey,
			signature : senderWallet.sign(ChainUtil.hash(transaction.outputs))
		}
	}

	static verifyTransaction(transaction){
		return ChainUtil.verifySignature(
			transaction.input.address,
			transaction.input.signature,
			ChainUtil.hash(transaction.outputs));
	}
}


module.exports = Transaction;