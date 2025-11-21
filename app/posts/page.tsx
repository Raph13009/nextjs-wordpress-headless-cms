import { getPostsPaginated } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Browse all our blog posts from WordPress",
};

export const dynamic = "auto";
export const revalidate = 60; // Revalidate every 60 seconds for fresh content

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const postsPerPage = 9;

  try {
    // Fetch posts from WordPress
    const postsResponse = await getPostsPaginated(page, postsPerPage);
    const { data: posts, headers } = postsResponse;
    const { total, totalPages } = headers;

    // Create pagination URL helper
    const createPaginationUrl = (newPage: number) => {
      if (newPage === 1) return "/posts";
      return `/posts?page=${newPage}`;
    };

    return (
      <Section>
        <Container>
          <div className="space-y-8">
            <Prose>
              <h1 className="text-4xl md:text-5xl font-bold">Blog Posts</h1>
              <p className="text-muted-foreground text-lg">
                {total > 0
                  ? `${total} ${total === 1 ? "article" : "articles"} disponible${total > 1 ? "s" : ""}`
                  : "Aucun article pour le moment"}
              </p>
            </Prose>

            {posts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center py-8">
                    <Pagination>
                      <PaginationContent>
                        {page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              href={createPaginationUrl(page - 1)}
                            />
                          </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((pageNum) => {
                            // Show current page, first page, last page, and 2 pages around current
                            return (
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              Math.abs(pageNum - page) <= 1
                            );
                          })
                          .map((pageNum, index, array) => {
                            const showEllipsis =
                              index > 0 && pageNum - array[index - 1] > 1;
                            return (
                              <div key={pageNum} className="flex items-center">
                                {showEllipsis && (
                                  <span className="px-2">...</span>
                                )}
                                <PaginationItem>
                                  <PaginationLink
                                    href={createPaginationUrl(pageNum)}
                                    isActive={pageNum === page}
                                  >
                                    {pageNum}
                                  </PaginationLink>
                                </PaginationItem>
                              </div>
                            );
                          })}

                        {page < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              href={createPaginationUrl(page + 1)}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="border rounded-lg p-12 bg-accent/25 flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-xl text-muted-foreground">
                  Aucun article trouvé
                </p>
                <p className="text-sm text-muted-foreground">
                  Créez des articles dans WordPress pour qu&apos;ils apparaissent ici.
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    
    return (
      <Section>
        <Container>
          <div className="space-y-8">
            <Prose>
              <h1 className="text-4xl md:text-5xl font-bold">Blog Posts</h1>
            </Prose>

            <div className="border rounded-lg p-12 bg-destructive/10 flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-xl font-semibold text-destructive">
                Erreur de connexion à WordPress
              </p>
              <div className="text-sm text-muted-foreground space-y-2 max-w-md">
                <p>
                  Impossible de récupérer les articles depuis WordPress.
                </p>
                <p className="font-medium mt-4">Vérifiez que :</p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>WordPress est installé et accessible</li>
                  <li>L&apos;API REST WordPress est activée</li>
                  <li>La variable d&apos;environnement WORDPRESS_URL est correctement configurée</li>
                  <li>L&apos;URL WordPress est accessible depuis votre serveur</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }
}
