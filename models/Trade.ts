import mongoose, { Schema, Document } from "mongoose";

export interface ITrade extends Document {
    userId: string;
    tradeType: "deposit" | "withdrawal";
    items: { id: string; name: string; count: number }[];
    timestamp: Date;
}

const TradeSchema = new Schema<ITrade>({
    userId: { type: String, required: true },
    tradeType: { type: String, enum: ["deposit", "withdrawal"], required: true },
    items: [
        {
            id: { type: String, required: true, unique: true }, // Unique ID for each item
            name: { type: String, required: true },
            count: { type: Number, required: true },
        },
    ],
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Trade || mongoose.model<ITrade>("Trade", TradeSchema);
