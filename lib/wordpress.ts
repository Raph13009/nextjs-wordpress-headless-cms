// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

const baseUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!baseUrl) {
  throw new Error("WORDPRESS_URL or NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not defined");
}

// Detect if this is a WordPress.com site
const isWordPressCom = baseUrl.includes('.wordpress.com');
const wpComSite = isWordPressCom ? baseUrl.replace('https://', '').replace('http://', '') : null;

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// New types for pagination support
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>
): Promise<T> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, any>
): Promise<WordPressResponse<T>> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// Helper function to convert WordPress.com API response to standard format
function convertWpComPostToStandard(wpComPost: any): Post {
  // Extract categories from terms.category object
  const categories: number[] = [];
  if (wpComPost.terms?.category) {
    Object.values(wpComPost.terms.category).forEach((cat: any) => {
      if (cat?.ID) categories.push(cat.ID);
    });
  }
  // Fallback to wpComPost.categories if terms.category doesn't exist
  if (categories.length === 0 && wpComPost.categories) {
    Object.values(wpComPost.categories).forEach((cat: any) => {
      if (cat?.ID) categories.push(cat.ID);
    });
  }

  // Extract tags from terms.post_tag object
  const tags: number[] = [];
  if (wpComPost.terms?.post_tag) {
    Object.values(wpComPost.terms.post_tag).forEach((tag: any) => {
      if (tag?.ID) tags.push(tag.ID);
    });
  }
  // Fallback to wpComPost.tags if terms.post_tag doesn't exist
  if (tags.length === 0 && wpComPost.tags) {
    Object.values(wpComPost.tags).forEach((tag: any) => {
      if (tag?.ID) tags.push(tag.ID);
    });
  }

  return {
    id: wpComPost.ID,
    date: wpComPost.date,
    date_gmt: wpComPost.date,
    guid: { rendered: wpComPost.guid || wpComPost.URL || "" },
    modified: wpComPost.modified,
    modified_gmt: wpComPost.modified,
    slug: wpComPost.slug,
    status: wpComPost.status || "publish",
    link: wpComPost.URL || "",
    title: { rendered: wpComPost.title || "" },
    content: { rendered: wpComPost.content || "", protected: false },
    excerpt: { rendered: wpComPost.excerpt || "", protected: false },
    author: wpComPost.author?.ID || 0,
    featured_media: wpComPost.featured_image ? 1 : 0,
    comment_status: (wpComPost.discussion?.comment_status || "open") as "open" | "closed",
    ping_status: (wpComPost.discussion?.ping_status || "open") as "open" | "closed",
    sticky: wpComPost.sticky || false,
    template: wpComPost.page_template || "",
    format: (wpComPost.format || "standard") as Post["format"],
    meta: {},
    categories,
    tags,
  };
}

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<Post[]>> {
  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts"];

  // Use WordPress.com API if detected
  if (isWordPressCom && wpComSite) {
    const query: Record<string, any> = {
      number: perPage,
      offset: (page - 1) * perPage,
      order_by: "date",
      order: "DESC", // Plus récents en premier
    };

    if (filterParams?.search) {
      query.search = filterParams.search;
      cacheTags.push("posts-search");
    }

    const url = `https://public-api.wordpress.com/rest/v1.1/sites/${wpComSite}/posts${
      query ? `?${querystring.stringify(query)}` : ""
    }`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Next.js WordPress Client",
      },
      next: {
        tags: cacheTags,
        revalidate: process.env.NODE_ENV === "development" ? 60 : 3600, // 1 minute en dev, 1 heure en prod
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText}`,
        response.status,
        url
      );
    }

    const wpComData = await response.json();
    const posts = (wpComData.posts || []).map(convertWpComPostToStandard);
    const total = wpComData.found || 0;
    const totalPages = Math.ceil(total / perPage);

    return {
      data: posts,
      headers: {
        total,
        totalPages,
      },
    };
  }

  // Standard WordPress REST API
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  // Add page-specific cache tag for granular invalidation
  cacheTags.push(`posts-page-${page}`);

  const url = `${baseUrl}/wp-json/wp/v2/posts${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    next: {
      tags: cacheTags,
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;

    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  } else {
    if (filterParams?.author) {
      query.author = filterParams.author;
    }
    if (filterParams?.tag) {
      query.tags = filterParams.tag;
    }
    if (filterParams?.category) {
      query.categories = filterParams.category;
    }
  }

  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostById(id: number): Promise<Post> {
  // Use WordPress.com API if detected
  if (isWordPressCom && wpComSite) {
    const url = `https://public-api.wordpress.com/rest/v1.1/sites/${wpComSite}/posts/${id}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Next.js WordPress Client",
      },
      next: {
        tags: ["wordpress", "posts", `post-${id}`],
        revalidate: process.env.NODE_ENV === "development" ? 60 : 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText}`,
        response.status,
        url
      );
    }

    const wpComPost = await response.json();
    return convertWpComPostToStandard(wpComPost);
  }

  return wordpressFetch<Post>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  // Use WordPress.com API if detected
  if (isWordPressCom && wpComSite) {
    const url = `https://public-api.wordpress.com/rest/v1.1/sites/${wpComSite}/posts/slug:${slug}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Next.js WordPress Client",
      },
      next: {
        tags: ["wordpress", "posts", `post-slug-${slug}`],
        revalidate: process.env.NODE_ENV === "development" ? 60 : 3600,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText}`,
        response.status,
        url
      );
    }

    const wpComPost = await response.json();
    return convertWpComPostToStandard(wpComPost);
  }

  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { slug }).then(
    (posts) => posts[0]
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories");
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags");
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then(
    (tags) => tags[0]
  );
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages");
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  return wordpressFetch<Page[]>("/wp-json/wp/v2/pages", { slug }).then(
    (pages) => pages[0]
  );
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users");
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: authorId });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { author: author.id });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<Post[]>("/wp-json/wp/v2/posts", { tags: tag.id });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
}

// Function specifically for generateStaticParams - fetches ALL posts
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  // Use WordPress.com API if detected
  if (isWordPressCom && wpComSite) {
    const allSlugs: { slug: string }[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `https://public-api.wordpress.com/rest/v1.1/sites/${wpComSite}/posts?number=100&offset=${(page - 1) * 100}`;
      
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Next.js WordPress Client",
        },
        next: {
          tags: ["wordpress", "posts", "post-slugs"],
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        throw new WordPressAPIError(
          `WordPress API request failed: ${response.statusText}`,
          response.status,
          url
        );
      }

      const wpComData = await response.json();
      const posts = wpComData.posts || [];
      const found = wpComData.found || 0;
      
      allSlugs.push(...posts.map((post: any) => ({ slug: post.slug })));

      hasMore = allSlugs.length < found;
      page++;
    }

    return allSlugs;
  }

  // Standard WordPress REST API
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wordpressFetchWithPagination<Post[]>(
      "/wp-json/wp/v2/posts",
      {
        per_page: 100,
        page,
        _fields: "slug", // Only fetch slug field for performance
      }
    );

    const posts = response.data;
    allSlugs.push(...posts.map((post) => ({ slug: post.slug })));

    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<Post[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  };

  return wordpressFetchWithPagination<Post[]>("/wp-json/wp/v2/posts", query);
}

export { WordPressAPIError };
