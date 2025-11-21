import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * Manual revalidation endpoint
 * Call this endpoint to manually refresh all WordPress content
 * 
 * Usage:
 * - GET /api/revalidate/manual?secret=YOUR_SECRET
 * - POST /api/revalidate/manual with x-webhook-secret header
 * 
 * This is useful for WordPress.com where you can't install plugins
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");

  if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret" },
      { status: 401 }
    );
  }

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
      message: "All WordPress content revalidated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Manual revalidation error:", error);
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

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

  if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: "Invalid webhook secret" },
      { status: 401 }
    );
  }

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
      message: "All WordPress content revalidated",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Manual revalidation error:", error);
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

