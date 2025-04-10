import mongoose, { Schema, Document } from "mongoose";

export interface TradeDocument extends Document {
  userId: string;
  tradeType: "deposit" | "withdrawal";
  itemName: string;
  count: number;
  withdrawn: boolean;
  timestamp: Date;
}

const TradeSchema = new Schema<TradeDocument>({
  userId: { type: String, required: true },
  tradeType: { type: String, enum: ["deposit", "withdrawal"], required: true },
  itemName: { type: String, required: true },
  count: { type: Number, required: true },
  withdrawn: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

// Explicitly specify the collection name as "inv"
export default mongoose.models.Trade || mongoose.model<TradeDocument>("Trade", TradeSchema, "inv");
