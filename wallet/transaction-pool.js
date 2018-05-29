const Transaction = require('../wallet/transaction');
const MINING_REWARD = require('../config');

class TransactionPool{
	
	constructor(){
		this.transactions = [];
	}

	updateOrAddTransaction(transaction){
		let transactionWithId = this.transactions.find(t => t.id === transaction.id);//If the tx already exists,this will capture the tx(not the id) and if the tx does not alredy exist,the variable will be undefined.
		if(transactionWithId){//If such a tx exists,then access the index of that tx in the array and replace it with the tx given as an argument.
			this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
		}else{
			this.transactions.push(transaction);
		}

	}

	existingTransaction(address){
		return this.transactions.find(t => t.input.address === address);
	}

	validTransactions(){
		return this.transactions.filter(transaction => {//Filter returns an array.
			const outputsTotal = transaction.outputs.reduce((total,output) => {//total(the 1st param) is the accumulator value which is returned and the 2nd param is the current value which is added.
				return total + output.amount;
			},0);//0 is the initial value of total;
			if(transaction.input.amount !== outputsTotal){
				console.log(`Invalid transaction from ${transaction.input.address}.`);
				return;
			}
			if(!Transaction.verifyTransaction(transaction)){
				console.log(`Invalid transaction from ${transaction.input.address}.`);
				return;
			}

			return transaction;      
		});
	}

	clear(){
		this.transactions = [];
	}
}

module.exports = TransactionPool;

//The if statement in the above method is only required when transaction outputs are updated with the same id(using the update method in transaction.js).