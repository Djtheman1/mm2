import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json(); // Get the userId from the request body

  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json(
      { message: "Invalid or missing userId" },
      { status: 400 }
    );
  }

  try {
    // Fetch user bio from Roblox API using userId
    const response = await fetch(`https://users.roblox.com/v1/users/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user bio");
    }

    const data = await response.json();
    const bio = data.description || "No bio available";

    return NextResponse.json({ bio });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch user bio" },
      { status: 500 }
    );
  }
}
