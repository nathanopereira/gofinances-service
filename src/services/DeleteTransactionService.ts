import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const transaction = await transactionRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    try {
      await transactionRepository.delete(id);
    } catch {
      throw new AppError('Delete not available');
    }
  }
}

export default DeleteTransactionService;
