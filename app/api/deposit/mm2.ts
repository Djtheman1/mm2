import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    await connectToDatabase();

    const { userId, secret, depositItems } = req.body;

    if (!userId || !secret || !Array.isArray(depositItems)) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        // Save deposited items to the database
        for (const item of depositItems) {
            await Trade.create({
                userId,
                tradeType: "deposit",
                itemName: item.item_name,
                count: item.count,
                withdrawn: false,
            });
        }

        res.status(200).json({ message: "Items deposited successfully" });
    } catch (error) {
        console.error("Error saving deposit:", error);
        res.status(500).json({ message: "Server error" });
    }
}
