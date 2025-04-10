import mongoose, { Schema, Document } from "mongoose";

export interface InventoryItem {
  itemName: string;
  count: number;
}

export interface UserDocument extends Document {
  userId: string;
  secret: string;
  inventory: InventoryItem[];
}

const InventoryItemSchema = new Schema<InventoryItem>({
  itemName: { type: String, required: true },
  count: { type: Number, required: true },
});

const UserSchema = new Schema<UserDocument>({
  userId: { type: String, required: true, unique: true },
  secret: { type: String, required: true },
  inventory: { type: [InventoryItemSchema], default: [] },
});

export default mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);