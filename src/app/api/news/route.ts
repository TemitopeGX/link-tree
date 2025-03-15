import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import News from "@/lib/models/News";

export async function GET() {
  try {
    await dbConnect();
    const news = await News.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .lean();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const newsItem = await News.create(data);
    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create news item" },
      { status: 500 }
    );
  }
}
