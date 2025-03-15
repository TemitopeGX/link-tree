import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Link from "@/lib/models/Link";

export async function GET() {
  try {
    await dbConnect();
    console.log("MongoDB connected successfully");

    const links = await Link.find().sort({ createdAt: -1 }).lean();
    console.log("Fetched links from MongoDB:", JSON.stringify(links, null, 2));

    if (!links || links.length === 0) {
      console.log("No links found in database");
    } else {
      console.log("Number of links found:", links.length);
      console.log(
        "Active links:",
        links.filter((link) => link.isActive).length
      );
      links.forEach((link, index) => {
        console.log(`Link ${index + 1}:`, {
          title: link.title,
          url: link.url,
          isActive: link.isActive,
        });
      });
    }

    return NextResponse.json(links);
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch links",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    console.log("MongoDB connected successfully");

    const data = await request.json();
    console.log("Received data:", data);

    // Ensure isActive is set to true by default if not provided
    const linkData = {
      ...data,
      clicks: 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    console.log("Creating link with data:", linkData);

    const link = await Link.create(linkData);
    console.log("Created link:", link);

    return NextResponse.json(link);
  } catch (error) {
    console.error("Failed to create link:", error);
    return NextResponse.json(
      {
        error: "Failed to create link",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
