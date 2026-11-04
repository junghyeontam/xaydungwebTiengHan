import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATION_SECRET || "junghyeon-secret-revalidate-key-2026";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-revalidate-secret");
    const body = await req.json().catch(() => ({}));

    // Verify authentication secret
    if (authHeader !== REVALIDATE_SECRET && body.secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized revalidation request: Invalid secret key" },
        { status: 401 }
      );
    }

    const { paths = [], tags = [], entityType, entityId } = body;
    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    // Revalidate paths
    for (const path of paths) {
      try {
        revalidatePath(path);
        revalidatedPaths.push(path);
      } catch (err) {
        console.warn(`Failed to revalidate path: ${path}`, err);
      }
    }

    // Revalidate tags
    for (const tag of tags) {
      try {
        revalidateTag(tag);
        revalidatedTags.push(tag);
      } catch (err) {
        console.warn(`Failed to revalidate tag: ${tag}`, err);
      }
    }

    // Common standard tags on content change
    if (entityType === "lesson" && entityId) {
      revalidatePath(`/lessons/${entityId}`);
      revalidatePath("/roadmap");
      revalidatePath("/sitemap.xml");
      revalidatedPaths.push(`/lessons/${entityId}`, "/roadmap", "/sitemap.xml");
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      revalidatedPaths,
      revalidatedTags,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal revalidation error" },
      { status: 500 }
    );
  }
}
