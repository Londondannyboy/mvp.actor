import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../../components/UnifiedHeader";
import { UnifiedFooter } from "../../components/UnifiedFooter";
import { ShareButtons } from "../../components/ShareButton";
import {
  newsArticles,
  getArticleBySlug,
  getRelatedArticles,
  formatDate,
  getAllSlugs,
} from "../../../lib/news-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Generate metadata for each article
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | EsportsJobs.quest",
    };
  }

  return {
    title: `${article.title} | Esports News`,
    description: article.excerpt,
    keywords: article.tags.join(", "),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `https://esportsjobs.quest/esports-news/${article.slug}`,
      images: [
        {
          url: article.image,
          width: 1200,
          height: 600,
          alt: article.title,
        },
      ],
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
    alternates: {
      canonical: `https://esportsjobs.quest/esports-news/${article.slug}`,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, 3);

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: article.author,
      url: "https://esportsjobs.quest",
    },
    publisher: {
      "@type": "Organization",
      name: "EsportsJobs.quest",
      url: "https://esportsjobs.quest",
      logo: {
        "@type": "ImageObject",
        url: "https://esportsjobs.quest/icon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://esportsjobs.quest/esports-news/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.tags.join(", "),
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://esportsjobs.quest",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Esports News",
        item: "https://esportsjobs.quest/esports-news",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://esportsjobs.quest/esports-news/${article.slug}`,
      },
    ],
  };

  // Convert content with basic markdown-style formatting
  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    return paragraphs.map((para, index) => {
      // Handle H2 headers
      if (para.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {para.replace("## ", "")}
          </h2>
        );
      }
      // Handle H3 headers
      if (para.startsWith("### ")) {
        return (
          <h3 key={index} className="text-xl font-bold text-white mt-6 mb-3">
            {para.replace("### ", "")}
          </h3>
        );
      }
      // Handle bold text at start (like **Key Finding**)
      if (para.startsWith("**") && para.includes("**:")) {
        const parts = para.split("**");
        return (
          <p key={index} className="text-slate-300 mb-4">
            <strong className="text-white">{parts[1]}</strong>
            {parts[2]}
          </p>
        );
      }
      // Handle numbered lists
      if (/^\d+\./.test(para)) {
        const items = para.split("\n").filter((line) => line.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4 text-slate-300">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}</li>
            ))}
          </ol>
        );
      }
      // Handle bullet lists
      if (para.startsWith("- ")) {
        const items = para.split("\n").filter((line) => line.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-slate-300">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^-\s*/, "").replace(/\*\*/g, "")}</li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return (
        <p key={index} className="text-slate-300 mb-4 leading-relaxed">
          {para}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <UnifiedHeader
        activeSite="jobs"
        siteNavItems={JOBS_SITE_NAV_ITEMS}
        ctaLabel="Browse Jobs"
        ctaHref="/esports-jobs"
      />

      <main>
        {/* Hero Section */}
        <section className="relative">
          {/* Hero Image */}
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>

          {/* Article Header */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
            <nav className="text-sm mb-6 text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/esports-news" className="hover:text-white transition-colors">
                Esports News
              </Link>
              <span className="mx-2">/</span>
              <span className="text-violet-400">{article.category}</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full">
                {article.category}
              </span>
              <span className="text-slate-400 text-sm">{article.readTime}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8">
              <span>By {article.author}</span>
              <span>|</span>
              <span>{formatDate(article.date)}</span>
              <span>|</span>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300"
              >
                Source: {article.source}
              </a>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-800/30 rounded-2xl p-8 md:p-12 border border-slate-700">
              {/* Lead paragraph */}
              <p className="text-xl text-slate-200 mb-8 leading-relaxed font-medium">
                {article.excerpt}
              </p>

              <hr className="border-slate-700 mb-8" />

              {/* Main content */}
              <article className="prose prose-invert prose-slate max-w-none">
                {renderContent(article.content)}
              </article>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-slate-400 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Share Section */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ShareButtons
              url={`https://esportsjobs.quest/esports-news/${article.slug}`}
              title={article.title}
            />
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="py-16 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-white mb-8">Related News</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/esports-news/${related.slug}`}
                    className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-violet-500/50 transition-all group"
                  >
                    <div className="aspect-video">
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded">
                          {related.category}
                        </span>
                        <span className="text-xs text-slate-500">{related.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">{related.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link
                  href="/esports-news"
                  className="inline-block px-6 py-3 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  View All News
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-2xl p-8 md:p-12 border border-slate-700 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Looking for Esports Career Opportunities?
              </h2>
              <p className="text-slate-300 mb-6">
                Browse the latest esports and gaming jobs in the UK and beyond.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/esports-jobs"
                  className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500 transition-colors"
                >
                  Browse Jobs
                </Link>
                <Link
                  href="/esports-salary-guide-uk"
                  className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
                >
                  UK Salary Guide
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <UnifiedFooter activeSite="jobs" />
    </div>
  );
}
