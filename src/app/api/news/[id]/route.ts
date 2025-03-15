import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import News from "@/lib/models/News";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const newsItem = await News.findByIdAndDelete(params.id);
    if (!newsItem) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "News item deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete news item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    const newsItem = await News.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!newsItem) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update news item" },
      { status: 500 }
    );
  }
}
