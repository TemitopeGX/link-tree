import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Link from "@/lib/models/Link";
import Blog from "@/lib/models/Blog";
import Tip from "@/lib/models/Tip";
import News from "@/lib/models/News";

interface BaseItem {
  _id: string;
  title: string;
  createdAt: string;
}

interface LinkItem extends BaseItem {
  url: string;
  icon?: string;
  clicks: number;
}

interface BlogItem extends BaseItem {
  slug: string;
  excerpt: string;
  author: string;
}

interface TipItem extends BaseItem {
  content: string;
  category: string;
}

interface NewsItem extends BaseItem {
  content: string;
  source?: string;
}

type ActivityItem = {
  _id: string;
  title: string;
  createdAt: Date;
  type: "link" | "blog" | "tip" | "news";
  url?: string;
  excerpt?: string;
  content?: string;
};

export async function GET() {
  try {
    await dbConnect();

    const [links, blogs, tips, news] = await Promise.all([
      Link.find().sort({ createdAt: -1 }).limit(5).lean<LinkItem[]>(),
      Blog.find().sort({ createdAt: -1 }).limit(5).lean<BlogItem[]>(),
      Tip.find().sort({ createdAt: -1 }).limit(5).lean<TipItem[]>(),
      News.find().sort({ createdAt: -1 }).limit(5).lean<NewsItem[]>(),
    ]);

    const activity: ActivityItem[] = [
      ...links.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        createdAt: new Date(item.createdAt),
        type: "link" as const,
        url: item.url,
      })),
      ...blogs.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        createdAt: new Date(item.createdAt),
        type: "blog" as const,
        excerpt: item.excerpt,
      })),
      ...tips.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        createdAt: new Date(item.createdAt),
        type: "tip" as const,
        content: item.content,
      })),
      ...news.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        createdAt: new Date(item.createdAt),
        type: "news" as const,
        content: item.content,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
