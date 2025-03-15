import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import dbConnect from "@/lib/mongodb";
import Link from "@/lib/models/Link";

// Delete a link
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    console.log("MongoDB connected successfully");

    const link = await Link.findByIdAndDelete(params.id).lean();

    if (!link) {
      console.log("Link not found:", params.id);
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    console.log("Link deleted successfully:", link);
    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Failed to delete link:", error);
    return NextResponse.json(
      {
        error: "Failed to delete link",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Update a link
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify auth token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Connect to database
    await dbConnect();

    // Update the link
    const result = await Link.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!result) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { message: "Error updating link" },
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
    console.log("MongoDB connected successfully");

    const data = await request.json();
    console.log("Received update data:", data);

    const link = await Link.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    ).lean();

    if (!link) {
      console.log("Link not found:", params.id);
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    console.log("Link updated successfully:", link);
    return NextResponse.json(link);
  } catch (error) {
    console.error("Failed to update link:", error);
    return NextResponse.json(
      {
        error: "Failed to update link",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
