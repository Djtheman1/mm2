import mongoose, { Schema, Document } from "mongoose";

export interface TradeDocument extends Document {
  userId: string;
  tradeType: "deposit" | "withdrawal";
  itemName: string;
  count: number;
  withdrawn: boolean; // New field to track withdrawal status
}

const TradeSchema = new Schema<TradeDocument>({
  userId: { type: String, required: true },
  tradeType: { type: String, enum: ["deposit", "withdrawal"], required: true },
  itemName: { type: String, required: true },
  count: { type: Number, required: true },
  withdrawn: { type: Boolean, default: false }, // Default to false
});

export default mongoose.models.Trade || mongoose.model<TradeDocument>("Trade", TradeSchema);
