const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');//get the public key in hexadecimals.
  }

  toString() {
    return `Wallet -
    publicKey : ${this.publicKey.toString()}
    balance   : ${this.balance}`
  }

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient,amount,blockchain,transactionPool){
    this.balance = this.calculateBalance(blockchain);
    if(amount > this.balance){
      console.log(`Amount: ${amount} exceeds current Balance: ${this.balance}`);
      return;//escape the function.
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if(transaction){//if there exists a tx with this address as input.....
      transaction.update(this,recipient,amount);
    }else{
      transaction = Transaction.newTransaction(this,recipient,amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain){
    let balance = this.balance;
    let transactions = [];

    //this will access every tx in the blockchain.
    blockchain.chain.forEach(block => block.data.forEach(transaction => {
      transactions.push(transaction);
    }));

    //this will create an array of all tx sent by the wallet.
    const walletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);

    let startTime = 0;

    if(walletInputTs.length > 0){
      //this will access the most recent tx sent by the wallet.
      const recentInputT = walletInputTs.reduce((prev,current) => prev.input.timestamp > current.input.timestamp ? prev : current);
      
      balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
      startTime = recentInputT.input.timestamp;
    }

    transactions.forEach(transaction => {
      if(transaction.input.timestamp > startTime){
        transaction.outputs.find(output => {
          if(output.address === this.publicKey){
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }



  static blockchainWallet(){
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet; 
  }
}

module.exports = Wallet;