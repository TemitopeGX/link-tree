import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tip from "@/lib/models/Tip";

export async function GET() {
  try {
    await dbConnect();
    const tips = await Tip.find({ isPublished: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(tips);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tips" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const tip = await Tip.create(data);
    return NextResponse.json(tip);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create tip" },
      { status: 500 }
    );
  }
}
