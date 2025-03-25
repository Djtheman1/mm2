import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json(
      { message: "Invalid or missing userId" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user picture");
    }

    const data = await response.json();
    const pictureUrl = data.data[0].imageUrl;
    console.log(pictureUrl);
    return NextResponse.json({ url: pictureUrl as string });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch user picture" },
      { status: 500 }
    );
  }
}
