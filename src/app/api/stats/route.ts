import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Link from "@/lib/models/Link";
import Blog from "@/lib/models/Blog";
import Tip from "@/lib/models/Tip";
import News from "@/lib/models/News";

interface Stats {
  totalLinks: number;
  totalClicks: number;
  totalBlogPosts: number;
  totalTips: number;
  totalNews: number;
}

export async function GET() {
  try {
    await dbConnect();

    const [links, clicksResult, blogPosts, tips, news] = await Promise.all([
      Link.countDocuments({ isPublished: true }),
      Link.aggregate([
        { $match: { isPublished: true } },
        { $group: { _id: null, total: { $sum: "$clicks" } } },
      ]),
      Blog.countDocuments({ isPublished: true }),
      Tip.countDocuments({ isPublished: true }),
      News.countDocuments({ isPublished: true }),
    ]);

    const stats: Stats = {
      totalLinks: links,
      totalClicks: clicksResult[0]?.total || 0,
      totalBlogPosts: blogPosts,
      totalTips: tips,
      totalNews: news,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
