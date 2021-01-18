import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';

import uploadConfig from '../config/upload';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

async function loadCSV(filePath: string): Promise<Request[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    ltrim: true,
    rtrim: true,
    columns: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: Request[] = [];

  parseCSV.on('data', line => lines.push(line));

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, fileName);

    const data = await loadCSV(csvFilePath);

    const createTransaction = new CreateTransactionService();

    const transactions = data.map(async ({ type, value, title, category }) => {
      const transaction = await createTransaction.execute({
        categoryTitle: category,
        value,
        type,
        title,
      });

      return transaction;
    });

    return Promise.all(transactions);
  }
}

export default ImportTransactionsService;
