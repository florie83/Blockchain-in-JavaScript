const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
  let tp, wallet, transaction;
  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    bc = new Blockchain();
    //transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
    //tp.updateOrAddTransaction(transaction);
    transaction = wallet.createTransaction('r4nd-4dre55',30,bc,tp);//test 59(valid txs)
  });

  it('adds a transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];//this is not an empty array because a new tx has alredy been created and added to the pool in the above beforeEach block.
      //If we don't do this,validTransactions will not equal tp.validTransactions

      //txs in the pool will now be valid plus corrupt but txs in the validTransactions array will only be valid
      for(let i=0;i<6;i++){
        wallet = new Wallet();
        transaction = wallet.createTransaction('random address',30,bc,tp);
        if(i%2 == 0){
          transaction.input.amount = 9999;
        }else{
          validTransactions.push(transaction);
        }
      }   

      it('shows a difference between valid and corrupt transactions', () => {
        expect(JSON.stringify(tp.transactions)).not.toEqual(validTransactions);//because tp.transactions contains invalid transactions as well
      });

      it('grabs valid transactions', () => {
        expect(JSON.stringify(tp.validTransactions)).toEqual(validTransactions);
      });
    });
  });

  it('clears transactions', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });
});


