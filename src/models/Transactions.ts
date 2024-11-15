//src/models/Transactions.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: string; 
  type: 'credit' | 'debit'; 
  amount: number;
  description: string;
  recipientUsername?: string; 
  createdAt: Date; 
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    userId: { type: String, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    recipientUsername: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
