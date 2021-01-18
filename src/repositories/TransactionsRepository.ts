import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance = (await this.find()).reduce(
      (prev, curr) => {
        if (curr.type === 'income') {
          return {
            ...prev,
            income: curr.value + prev.income,
            total: prev.total + curr.value,
          };
        }

        if (curr.type === 'outcome') {
          return {
            ...prev,
            outcome: curr.value + prev.outcome,
            total: prev.total - curr.value,
          };
        }

        return prev;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
