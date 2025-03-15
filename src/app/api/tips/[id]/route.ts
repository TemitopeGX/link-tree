import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tip from "@/lib/models/Tip";

export async function GET(request: NextRequest, { params }: any) {
  try {
    await dbConnect();
    const tip = await Tip.findById(params.id).lean();

    if (!tip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }

    return NextResponse.json(tip);
  } catch (error) {
    console.error("Error fetching tip:", error);
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
    const updatedTip = await Tip.findByIdAndUpdate(params.id, body, {
      new: true,
    }).lean();

    if (!updatedTip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTip);
  } catch (error) {
    console.error("Error updating tip:", error);
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

    const updatedTip = await Tip.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).lean();

    if (!updatedTip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTip);
  } catch (error) {
    console.error("Error updating tip:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    await dbConnect();
    const deletedTip = await Tip.findByIdAndDelete(params.id).lean();

    if (!deletedTip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tip deleted successfully" });
  } catch (error) {
    console.error("Error deleting tip:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
