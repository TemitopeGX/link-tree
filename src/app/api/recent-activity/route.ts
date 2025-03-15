import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Link from "@/lib/models/Link";
import Blog from "@/lib/models/Blog";
import Tip from "@/lib/models/Tip";
import News from "@/lib/models/News";

interface ActivityItem {
  _id: string;
  title: string;
  createdAt: Date;
  type: "link" | "blog" | "tip" | "news";
}

export async function GET() {
  try {
    await dbConnect();

    // Fetch recent items from each collection
    const [links, blogPosts, tips, news] = await Promise.all([
      Link.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt")
        .lean(),
      Blog.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt")
        .lean(),
      Tip.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt")
        .lean(),
      News.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title createdAt")
        .lean(),
    ]);

    // Combine and format the results
    const activity = [
      ...links.map((item) => ({
        _id: item._id.toString(),
        title: item.title as string,
        createdAt: new Date(item.createdAt),
        type: "link" as const,
      })),
      ...blogPosts.map((item) => ({
        _id: item._id.toString(),
        title: item.title as string,
        createdAt: new Date(item.createdAt),
        type: "blog" as const,
      })),
      ...tips.map((item) => ({
        _id: item._id.toString(),
        title: item.title as string,
        createdAt: new Date(item.createdAt),
        type: "tip" as const,
      })),
      ...news.map((item) => ({
        _id: item._id.toString(),
        title: item.title as string,
        createdAt: new Date(item.createdAt),
        type: "news" as const,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
