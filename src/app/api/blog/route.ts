import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";

export async function GET() {
  try {
    await dbConnect();
    const posts = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const data = await request.json();
    const post = await Blog.create(data);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
