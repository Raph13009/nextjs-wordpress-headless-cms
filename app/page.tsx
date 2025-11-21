// Craft Imports
import { Section, Container, Prose, Box } from "@/components/craft";
import Balancer from "react-wrap-balancer";

// Next.js Imports
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";
import { AnimatedRose } from "@/components/animated-rose";

// Icons
import {
  File,
  Pen,
  Tag,
  Diamond,
  User,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Code,
  Layout,
} from "lucide-react";
import { WordPressIcon } from "@/components/icons/wordpress";
import { NextJsIcon } from "@/components/icons/nextjs";

// This page is using the craft.tsx component and design system
export default function Home() {
  return (
    <>
      {/* Animated Rose Background */}
      <AnimatedRose />

      {/* Hero Section */}
      <Section className="border-b relative z-10">
        <Container>
          <Box
            direction="col"
            gap={8}
            className="text-center max-w-3xl mx-auto py-12 md:py-20"
          >
            <Box direction="col" gap={4} className="items-center">
              <Box gap={3} className="items-center justify-center">
                <WordPressIcon
                  className="text-foreground"
                  width={48}
                  height={48}
                />
                <span className="text-2xl text-muted-foreground">+</span>
                <NextJsIcon
                  className="text-foreground"
                  width={48}
                  height={48}
                />
              </Box>
              <Prose>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  <Balancer>
                    Modern Headless CMS with Next.js & WordPress
                  </Balancer>
                </h1>
                <p className="text-xl text-muted-foreground mt-6">
                  <Balancer>
                    Build lightning-fast websites with the power of Next.js and
                    the flexibility of WordPress as your content management
                    system.
                  </Balancer>
                </p>
              </Prose>
            </Box>

            <Box gap={4} className="justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/posts">
                  Explore Posts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pages">View Pages</Link>
              </Button>
            </Box>
          </Box>
        </Container>
      </Section>

      {/* Features Section */}
      <Section>
        <Container>
          <Box direction="col" gap={12}>
            <Prose className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                <Balancer>Why Choose This Stack?</Balancer>
              </h2>
              <p className="text-muted-foreground">
                <Balancer>
                  The perfect combination of modern frontend technology and
                  powerful content management.
                </Balancer>
              </p>
            </Prose>

            <Box
              cols={{ base: 1, md: 2, lg: 3 }}
              gap={6}
              className="mt-8"
            >
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Lightning Fast"
                description="Built with Next.js for optimal performance, server-side rendering, and static site generation."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Secure & Reliable"
                description="WordPress backend provides robust security and content management capabilities."
              />
              <FeatureCard
                icon={<Globe className="h-6 w-6" />}
                title="SEO Optimized"
                description="Next.js SSR and SSG ensure your content is perfectly indexed by search engines."
              />
              <FeatureCard
                icon={<Code className="h-6 w-6" />}
                title="Developer Friendly"
                description="TypeScript support, modern tooling, and a clean architecture for easy development."
              />
              <FeatureCard
                icon={<Layout className="h-6 w-6" />}
                title="Flexible Design"
                description="Use shadcn/ui and Tailwind CSS to create beautiful, responsive interfaces."
              />
              <FeatureCard
                icon={<Pen className="h-6 w-6" />}
                title="Content Management"
                description="Leverage WordPress's intuitive admin interface for content creation and editing."
              />
            </Box>
          </Box>
        </Container>
      </Section>

      {/* Quick Links Section */}
      <Section className="bg-accent/30 relative z-10">
        <Container>
          <Box direction="col" gap={8}>
            <Prose className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                <Balancer>Explore Your Content</Balancer>
              </h2>
              <p className="text-muted-foreground">
                <Balancer>
                  Browse through posts, pages, authors, and more from your
                  WordPress CMS.
                </Balancer>
              </p>
            </Prose>

            <Box
              cols={{ base: 1, md: 2, lg: 3 }}
              gap={4}
              className="mt-8"
            >
              <QuickLinkCard
                icon={<Pen size={24} />}
                title="Posts"
                description="All posts from your WordPress"
                href="/posts"
              />
              <QuickLinkCard
                icon={<File size={24} />}
                title="Pages"
                description="Custom pages from your WordPress"
                href="/pages"
              />
              <QuickLinkCard
                icon={<User size={24} />}
                title="Authors"
                description="List of the authors from your WordPress"
                href="/posts/authors"
              />
              <QuickLinkCard
                icon={<Tag size={24} />}
                title="Tags"
                description="Content by tags from your WordPress"
                href="/posts/tags"
              />
              <QuickLinkCard
                icon={<Diamond size={24} />}
                title="Categories"
                description="Categories from your WordPress"
                href="/posts/categories"
              />
            </Box>
          </Box>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="relative z-10">
        <Container>
          <Box
            direction="col"
            gap={6}
            className="text-center max-w-2xl mx-auto py-12 px-6 rounded-lg border bg-card"
          >
            <Prose>
              <h2 className="text-3xl md:text-4xl font-bold">
                <Balancer>Ready to Get Started?</Balancer>
              </h2>
              <p className="text-muted-foreground mt-4">
                <Balancer>
                  Start building your next project with this powerful headless
                  CMS setup.
                </Balancer>
              </p>
            </Prose>
            <Box gap={4} className="justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/posts">
                  Browse Content
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://github.com/9d8dev/next-wp">
                  View Documentation
                </Link>
              </Button>
            </Box>
          </Box>
        </Container>
      </Section>
    </>
  );
}

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="border rounded-lg p-6 bg-card hover:shadow-lg transition-all">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

// Quick Link Card Component
const QuickLinkCard = ({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="border rounded-lg p-6 bg-card hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col gap-4 group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-accent text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
};
