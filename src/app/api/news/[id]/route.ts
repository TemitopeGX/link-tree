import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import News from "@/lib/models/News";

export async function GET(request: NextRequest, { params }: any) {
  try {
    await dbConnect();
    const newsItem = await News.findById(params.id).lean();

    if (!newsItem) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("Error fetching news item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: any) {
  try {
    await dbConnect();
    const body = await request.json();
    const updatedNews = await News.findByIdAndUpdate(params.id, body, {
      new: true,
    }).lean();

    if (!updatedNews) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Error updating news item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();

    const updatedNews = await News.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).lean();

    if (!updatedNews) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Error updating news item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    await dbConnect();
    const deletedNews = await News.findByIdAndDelete(params.id).lean();

    if (!deletedNews) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "News item deleted successfully" });
  } catch (error) {
    console.error("Error deleting news item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
