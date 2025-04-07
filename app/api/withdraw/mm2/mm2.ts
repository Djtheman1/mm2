import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Trade from "@/models/Trade";

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
        // Fetch all withdrawal items for the user that have not been withdrawn yet
        const withdrawals = await Trade.find({
            userId,
            tradeType: "withdrawal",
            withdrawn: false,
        });

        res.status(200).json(withdrawals);
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        res.status(500).json({ message: "Server error" });
    }
}
