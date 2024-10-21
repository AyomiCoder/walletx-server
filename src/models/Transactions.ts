import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: string; // Reference to the user
  type: 'credit' | 'debit'; // Type of transaction (add money or send money)
  amount: number; // Amount involved in the transaction
  description: string;
  recipientUsername?: string; // Username of the recipient (optional for add transactions)
  createdAt: Date; // Date of transaction
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
