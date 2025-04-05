import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import Trade from "../../../models/Trade";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    await connectToDatabase();

    const { userId, secret } = req.body;

    if (!userId || !secret) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        // Fetch all items for the user
        const inventory = await Trade.find({ userId });

        res.status(200).json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Server error" });
    }
}