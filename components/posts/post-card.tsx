import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

export async function PostCard({ post }: { post: Post }) {
  // Safely fetch media, author, and category with error handling
  let media = null;
  let author = null;
  let category = null;

  try {
    if (post.featured_media) {
      media = await getFeaturedMediaById(post.featured_media);
    }
  } catch (error) {
    console.warn("Failed to fetch featured media:", error);
  }

  try {
    if (post.author) {
      author = await getAuthorById(post.author);
    }
  } catch (error) {
    console.warn("Failed to fetch author:", error);
  }

  try {
    if (post.categories?.[0]) {
      category = await getCategoryById(post.categories[0]);
    }
  } catch (error) {
    console.warn("Failed to fetch category:", error);
  }

  const date = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date inconnue";

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
          {media?.source_url ? (
            <Image
              className="h-full w-full object-cover"
              src={media.source_url}
              alt={post.title?.rendered || "Post thumbnail"}
              width={400}
              height={200}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
              Aucune image
            </div>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div
          className="text-sm text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.replace(/<[^>]*>/g, "").split(" ").slice(0, 20).join(" ").trim() +
                "..."
              : "Aucun résumé disponible",
          }}
        ></div>
      </div>

      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <p className="font-medium">{category?.name || "Sans catégorie"}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
