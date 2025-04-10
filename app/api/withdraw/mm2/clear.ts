import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";
import Trade from "../../../../models/Trade";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectToDatabase();

  const { userId, secret, clearedItems } = req.body;

  if (!userId || !secret || !Array.isArray(clearedItems)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    for (const item of clearedItems) {
      await Trade.updateOne(
        { userId, itemName: item.item_name, withdrawn: false },
        { $set: { withdrawn: true, timestamp: new Date() } }
      );
    }

    res.status(200).json({ message: "Items marked as withdrawn" });
  } catch (error) {
    console.error("Error marking items as withdrawn:", error);
    res.status(500).json({ message: "Server error" });
  }
}