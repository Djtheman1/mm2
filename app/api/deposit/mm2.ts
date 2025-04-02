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
        const account = await db.collection("accounts").findOne({ robloxId: userId });

        if (!account) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        let depositedItems: any[] = [];
        let failedItems: any[] = [];

        for (const item of items) {
            const foundItem = await db.collection("items").findOne({ item_name: item.item_name });

            if (!foundItem) {
                failedItems.push(item);
                continue;
            }

            for (let i = 0; i < item.count; i++) {
                await db.collection("inventory").insertOne({
                    item: foundItem._id,
                    owner: account._id,
                    locked: false,
                    game: "MM2",
                });
            }

            depositedItems.push(item);
        }

        return res.status(200).json({
            success: true,
            message: "Deposit processed",
            deposited: depositedItems,
            failed: failedItems,
        });

    } catch (error) {
        console.error("Deposit Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
