import { getAllCategories } from "@/lib/wordpress";
import type { Category } from "@/lib/wordpress.d";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all categories of our blog posts",
  alternates: {
    canonical: "/posts/categories",
  },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  let categories: Category[] = [];
  try {
    categories = await getAllCategories();
  } catch (error) {
    console.warn("Failed to fetch categories:", error);
  }

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Categories</h2>
          <ul className="grid">
            {categories.map((category: any) => (
              <li key={category.id}>
                <Link href={`/posts/?category=${category.id}`}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
