import { getAllPages } from "@/lib/wordpress";
import type { Page } from "@/lib/wordpress.d";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Pages",
  description: "Browse all pages of our blog posts",
  alternates: {
    canonical: "/posts/pages",
  },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  let pages: Page[] = [];
  try {
    pages = await getAllPages();
  } catch (error) {
    console.warn("Failed to fetch pages:", error);
  }

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Pages</h2>
          <ul className="grid">
            {pages.map((page) => (
              <li key={page.id}>
                <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
