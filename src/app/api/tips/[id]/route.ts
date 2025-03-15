import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tip from "@/lib/models/Tip";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const tip = await Tip.findByIdAndDelete(params.id);
    if (!tip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Tip deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete tip" },
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
    const tip = await Tip.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!tip) {
      return NextResponse.json({ error: "Tip not found" }, { status: 404 });
    }
    return NextResponse.json(tip);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update tip" },
      { status: 500 }
    );
  }
}
