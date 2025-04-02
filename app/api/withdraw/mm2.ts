import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db"; 
import crypto from "crypto";

const TRANSACTION_SECRET_HASH = crypto.createHash("sha256").update(process.env.TRANSACTION_SECRET!).digest("hex");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method Not Allowed" });

    const { userId, items, secret } = req.body;

    if (!userId || !items || !secret) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (secret !== TRANSACTION_SECRET_HASH) {
        return res.status(401).json({ success: false, message: "Unauthorized request" });
    }

    try {
        const db = await connectToDatabase();
        const user = await db.collection("accounts").findOne({ robloxId: userId });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        let withdrawnItems: any[] = [];
        let failedItems: any[] = [];

        for (const item of items) {
            const inventoryItem = await db.collection("inventory").findOne({
                item: item.item_name,
                owner: user._id,
                locked: false,
            });

            if (!inventoryItem) {
                failedItems.push(item);
                continue;
            }

            await db.collection("inventory").updateOne({ _id: inventoryItem._id }, { $set: { locked: true } });
            withdrawnItems.push(item);
        }

        return res.status(200).json({
            success: true,
            message: "Withdrawal processed",
            withdrawn: withdrawnItems,
            failed: failedItems,
        });

    } catch (error) {
        console.error("Withdraw Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
