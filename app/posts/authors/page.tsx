import { getAllAuthors } from "@/lib/wordpress";
import type { Author } from "@/lib/wordpress.d";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Authors",
  description: "Browse all authors of our blog posts",
  alternates: {
    canonical: "/posts/authors",
  },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  let authors: Author[] = [];
  try {
    authors = await getAllAuthors();
  } catch (error) {
    console.warn("Failed to fetch authors:", error);
  }

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Authors</h2>
          <ul className="grid">
            {authors.map((author: any) => (
              <li key={author.id}>
                <Link href={`/posts/?author=${author.id}`}>{author.name}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
