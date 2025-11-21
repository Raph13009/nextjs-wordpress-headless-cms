import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Automatic revalidation endpoint
 * This endpoint checks for new posts and revalidates if needed
 * Can be called by a cron job or scheduled task
 * 
 * Usage:
 * - GET /api/revalidate/auto (no authentication needed for internal use)
 * - Can be called by Vercel Cron Jobs, GitHub Actions, or external services
 */

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Revalidate all WordPress content
    revalidateTag("wordpress");
    revalidateTag("posts");
    
    // Revalidate all post pages (up to page 10)
    for (let i = 1; i <= 10; i++) {
      revalidateTag(`posts-page-${i}`);
    }
    
    // Revalidate paths
    revalidatePath("/posts");
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      message: "All WordPress content automatically revalidated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Auto revalidation error:", error);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Failed to revalidate",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

