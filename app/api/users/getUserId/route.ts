import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json(); // Get the username from the request body

  if (!username || typeof username !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing username" },
      { status: 400 }
    );
  }

  try {
    // Fetch userId from Roblox API using username
    const response = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch userId");
    }

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const userId = data.data[0].id;
      return NextResponse.json({ userId });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch userId" },
      { status: 500 }
    );
  }
}
