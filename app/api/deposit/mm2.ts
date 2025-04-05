import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    await connectToDatabase();

    const { userId, secret, depositItems } = req.body;

    if (!userId || !secret || !depositItems || !Array.isArray(depositItems)) {
        return res.status(400).json({ message: "Invalid trade data" });
    }

    // Assign unique IDs to each item
    const itemsWithUniqueIds = depositItems.map(item => ({
        id: uuidv4(),  // Generate a unique ID
        name: item.name,
        count: item.count,
    }));

    try {
        await Trade.create({
            userId,
            tradeType: "deposit",
            items: itemsWithUniqueIds,
        });

        res.status(200).json({ message: "Deposit recorded successfully!" });
    } catch (error) {
        console.error("Error saving deposit:", error);
        res.status(500).json({ message: "Server error" });
    }
}
