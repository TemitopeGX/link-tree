import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Blog from "@/lib/models/Blog";

type Context = {
  params: {
    slug: string;
  };
};

export async function GET(
  request: Request | NextRequest,
  context: Context
): Promise<Response | NextResponse> {
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug: context.params.slug }).lean();

    if (!blog) {
      return Response.json({ error: "Blog post not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request | NextRequest,
  context: Context
): Promise<Response | NextResponse> {
  try {
    await dbConnect();
    const body = await request.json();
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug: context.params.slug },
      body,
      { new: true }
    ).lean();

    if (!updatedBlog) {
      return Response.json({ error: "Blog post not found" }, { status: 404 });
    }

    return Response.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request | NextRequest,
  context: Context
): Promise<Response | NextResponse> {
  try {
    await dbConnect();
    const deletedBlog = await Blog.findOneAndDelete({
      slug: context.params.slug,
    }).lean();

    if (!deletedBlog) {
      return Response.json({ error: "Blog post not found" }, { status: 404 });
    }

    return Response.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
