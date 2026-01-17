import Link from "next/link";
import { Metadata } from "next";
import { UnifiedHeader, JOBS_SITE_NAV_ITEMS } from "../components/UnifiedHeader";
import { UnifiedFooter } from "../components/UnifiedFooter";
import { JobSearch } from "../components/JobSearch";
import { esportsJobs, getAllCategories, EsportsJob, generateJobListingSchema } from "../../lib/jobs-data";

// YouTube videos for job pages - VERIFIED WORKING IDs
const gameSpecificVideos: Record<string, { id: string; title: string }> = {
  "League of Legends": { id: "5FWIuIBoZBk", title: "Inside the Esports Industry" },
  "Valorant": { id: "5FWIuIBoZBk", title: "Inside the Esports Industry" },
  "Rocket League": { id: "5FWIuIBoZBk", title: "Inside the Esports Industry" },
  "Counter-Strike": { id: "5FWIuIBoZBk", title: "Inside the Esports Industry" },
  "Overwatch": { id: "5FWIuIBoZBk", title: "Inside the Esports Industry" },
  "default": { id: "5FWIuIBoZBk", title: "Inside the Esports Industry" },
};

// Target keyword: "esports jobs"
export const metadata: Metadata = {
  title: "Esports Jobs 🎮 Browse Gaming Careers",
  description: "🔥 Esports jobs in coaching, marketing, production & management. Browse open positions at top gaming organisations. Apply direct to employers today.",
  keywords: "esports jobs, gaming jobs, esports careers",
  openGraph: {
    title: "Esports Jobs 🎮 Browse Gaming Careers",
    description: "🔥 Esports jobs in coaching, marketing, production & management. Browse open positions at top gaming organisations.",
    type: "website",
    url: "https://mvp.actor/esports-jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Esports Jobs 🎮 Browse Gaming Careers",
    description: "🔥 Esports jobs in coaching, marketing, production & management.",
  },
  alternates: {
    canonical: "https://mvp.actor/esports-jobs",
  },
};

// Structured data for the jobs page
const jobsPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Esports Jobs - Find Gaming Industry Careers",
  description: "Browse esports jobs in coaching, marketing, production, content creation and management roles.",
  url: "https://mvp.actor/esports-jobs",
  mainEntity: {
    "@type": "ItemList",
    name: "Esports Job Listings",
    numberOfItems: esportsJobs.length,
  },
};

const categoryLabels: Record<string, string> = {
  coaching: "Coaching",
  marketing: "Marketing",
  production: "Production",
  management: "Management",
  content: "Content",
  operations: "Operations",
};

const categoryColors: Record<string, string> = {
  coaching: "bg-green-500/20 border-green-500/50 text-green-400",
  marketing: "bg-purple-500/20 border-purple-500/50 text-purple-400",
  production: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
  management: "bg-amber-500/20 border-amber-500/50 text-amber-400",
  content: "bg-pink-500/20 border-pink-500/50 text-pink-400",
  operations: "bg-blue-500/20 border-blue-500/50 text-blue-400",
};

// Search function
function searchJobs(jobs: EsportsJob[], query: string): EsportsJob[] {
  if (!query || query.trim() === "") return jobs;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  return jobs.filter((job) => {
    const searchableText = [
      job.title,
      job.company,
      job.location,
      job.country,
      job.description,
      ...job.skills,
      job.category,
    ]
      .join(" ")
      .toLowerCase();

    return searchTerms.every((term) => searchableText.includes(term));
  });
}

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function JobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const categoryFilter = params.category || "";

  // Filter jobs based on search query
  let filteredJobs = searchJobs(esportsJobs, query);

  // Apply category filter if present
  if (categoryFilter) {
    filteredJobs = filteredJobs.filter((job) => job.category === categoryFilter);
  }

  const categories = getAllCategories();
  const isSearching = query.length > 0 || categoryFilter.length > 0;

  // Generate schema for filtered jobs
  const jobListingSchema = generateJobListingSchema(filteredJobs);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Google JobPosting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListingSchema) }}
      />
      {/* Page-level Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsPageSchema) }}
      />

      <UnifiedHeader
        activeSite="jobs"
        siteNavItems={JOBS_SITE_NAV_ITEMS}
        ctaLabel="Post a Job"
        ctaHref="/contact"
      />

      {/* Hero Section - Optimized for "Esports Jobs" */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#0d0d15] to-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* H1 optimized for "Esports Jobs" keyword */}
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            {isSearching ? (
              <>
                <span className="text-cyan-400">Esports Jobs</span> Search Results
              </>
            ) : (
              <>
                <span className="text-cyan-400">Esports Jobs</span> Worldwide
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-4">
            {isSearching
              ? `Found ${filteredJobs.length} esports job${filteredJobs.length !== 1 ? "s" : ""} matching your search.`
              : "Find your dream esports job. Browse esports jobs in coaching, marketing, production, content creation, and management."}
          </p>

          {!isSearching && (
            <p className="text-gray-400 max-w-3xl mx-auto mb-8">
              Live esports job listings curated by our <Link href="/" className="text-cyan-400 hover:text-cyan-300 underline">esports recruiters</Link>. Apply direct to top gaming organisations. Your trusted <Link href="/" className="text-cyan-400 hover:text-cyan-300 underline">esports recruiter</Link> for gaming careers.
            </p>
          )}

          {/* Search Bar */}
          <JobSearch initialQuery={query} size="large" className="mb-6" />

          <div className="inline-block px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
            {filteredJobs.length} esports jobs {isSearching ? "found" : "currently listed"}
          </div>

          {isSearching && (
            <div className="mt-4">
              <Link href="/esports-jobs" className="text-cyan-400 hover:underline text-sm">
                ← View all esports jobs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Transparency Notice */}
      <section className="py-4 bg-amber-500/10 border-y border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-amber-300 text-sm">
            <strong>Transparency:</strong> These jobs are aggregated from public sources. We do not
            represent these employers. Click through to apply directly on their official sites.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section id="categories" className="py-8 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/esports-jobs"
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
                !categoryFilter
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                  : "bg-gray-800/50 border-gray-700 text-gray-400"
              }`}
            >
              All ({esportsJobs.length})
            </Link>
            {categories.map((category) => {
              const count = esportsJobs.filter((j) => j.category === category).length;
              const isActive = categoryFilter === category;
              return (
                <Link
                  key={category}
                  href={`/esports-jobs?category=${category}`}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
                    isActive ? categoryColors[category] : "bg-gray-800/50 border-gray-700 text-gray-400"
                  }`}
                >
                  {categoryLabels[category]} ({count})
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <section className="py-16 bg-[#0d0d15]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">No Jobs Found</h2>
            <p className="text-gray-400 mb-6">
              We couldn&apos;t find any jobs matching &ldquo;{query}&rdquo;. Try a different search term or
              browse all available positions.
            </p>
            <Link
              href="/esports-jobs"
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-lg transition-all"
            >
              View All Jobs
            </Link>
          </div>
        </section>
      ) : isSearching ? (
        // Show all matching jobs in one section when searching
        <section className="py-12 bg-[#0d0d15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">
              {filteredJobs.length} Result{filteredJobs.length !== 1 ? "s" : ""}
            </h2>
            <div className="grid gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        // Show jobs by category when not searching
        categories.map((category) => {
          const categoryJobs = filteredJobs.filter((j) => j.category === category);
          if (categoryJobs.length === 0) return null;

          return (
            <section key={category} id={category} className="py-12 bg-[#0d0d15]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${categoryColors[category]}`}>
                    {categoryLabels[category]}
                  </span>
                  <span className="text-gray-400 text-lg font-normal">
                    {categoryJobs.length} {categoryJobs.length === 1 ? "job" : "jobs"}
                  </span>
                </h2>
                <div className="grid gap-4">
                  {categoryJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* Source Attribution */}
      <section className="py-12 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-bold mb-4">About These Listings</h2>
          <p className="text-gray-400 mb-4">
            We aggregate esports job listings from public sources including LinkedIn, Workday career
            sites, and company job boards. We do not represent these employers and have no
            affiliation with them.
          </p>
          <p className="text-gray-400">
            When you click &ldquo;Apply&rdquo;, you will be taken directly to the employer&apos;s
            official job posting where you can submit your application.
          </p>
        </div>
      </section>

      {/* Esports Career Videos Section */}
      <section className="py-16 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-cyan-400">Watch:</span> Esports Career Insights
            </h2>
            <p className="text-gray-400">
              Learn more about working in the esports industry from these videos
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${gameSpecificVideos.default.id}`}
                  title={gameSpecificVideos.default.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{gameSpecificVideos.default.title}</h3>
                <p className="text-gray-400 text-sm mt-1">General esports career advice and tips</p>
              </div>
            </div>
            <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${gameSpecificVideos["League of Legends"].id}`}
                  title={gameSpecificVideos["League of Legends"].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{gameSpecificVideos["League of Legends"].title}</h3>
                <p className="text-gray-400 text-sm mt-1">Insights from League of Legends esports professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - "Esports Jobs" Keyword Optimization */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Find Your Perfect <span className="text-cyan-400">Esports Job</span>
          </h2>

          <div className="prose prose-lg prose-invert max-w-none space-y-8">
            <p className="text-gray-300 leading-loose text-lg">
              Looking for <strong>esports jobs</strong>? You&apos;ve come to the right place. As the leading <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link>, we aggregate the latest opportunities from across the gaming industry, including roles at top organisations like Team Liquid, Fnatic, Cloud9, and major game publishers.
            </p>

            <p className="text-gray-400 leading-loose text-lg">
              <strong className="text-white">Esports jobs</strong> span a wide range of roles: from esports coaching positions and analyst roles to esports marketing jobs, content creation, event management, and broadcast production. Whether you&apos;re looking for entry-level esports jobs or senior management positions, we list opportunities for all experience levels.
            </p>

            <h3 className="text-xl font-bold text-white mt-10 mb-6">Types of Esports Jobs We List</h3>
            <ul className="text-gray-400 space-y-4 list-disc list-inside text-lg">
              <li><strong className="text-cyan-400">Esports Coaching Jobs</strong> - Train professional players and teams</li>
              <li><strong className="text-cyan-400">Esports Marketing Jobs</strong> - Promote teams, events, and brands</li>
              <li><strong className="text-cyan-400">Esports Production Jobs</strong> - Broadcast and video production roles</li>
              <li><strong className="text-cyan-400">Esports Management Jobs</strong> - Team and organisation management</li>
              <li><strong className="text-cyan-400">Esports Content Jobs</strong> - Content creation and social media</li>
              <li><strong className="text-cyan-400">Esports Operations Jobs</strong> - Event and arena operations</li>
            </ul>

            <p className="text-gray-400 leading-loose text-lg mt-10">
              All esports jobs on our board link directly to the employer&apos;s official job posting. We aggregate listings from LinkedIn, Workday, and company career sites to bring you the most comprehensive esports job search experience. Our <Link href="/" className="text-cyan-400 underline hover:text-cyan-300">esports recruitment agency</Link> is here to help you land your dream role.
            </p>

            <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30">
              <h3 className="text-lg font-bold text-white mb-4">Trusted Industry Resources</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="https://britishesports.org" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">British Esports</a>
                <span className="text-gray-600">•</span>
                <a href="https://esportsinsider.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Esports Insider</a>
                <span className="text-gray-600">•</span>
                <a href="https://ukie.org.uk" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">UKIE</a>
                <span className="text-gray-600">•</span>
                <a href="https://www.gamesindustry.biz" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">GamesIndustry.biz</a>
                <span className="text-gray-600">•</span>
                <a href="https://liquipedia.net" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Liquipedia</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Location - Internal Linking for Topic Cluster */}
      <section className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Browse <span className="text-cyan-400">Esports Jobs</span> by Location
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Link href="/esports-jobs-usa" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all text-center">
              <span className="text-2xl">🇺🇸</span>
              <span className="text-white font-medium ml-2">USA</span>
            </Link>
            <Link href="/esports-jobs-uk" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all text-center">
              <span className="text-2xl">🇬🇧</span>
              <span className="text-white font-medium ml-2">UK</span>
            </Link>
            <Link href="/esports-jobs-germany" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all text-center">
              <span className="text-2xl">🇩🇪</span>
              <span className="text-white font-medium ml-2">Germany</span>
            </Link>
            <Link href="/esports-jobs-canada" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all text-center">
              <span className="text-2xl">🇨🇦</span>
              <span className="text-white font-medium ml-2">Canada</span>
            </Link>
            <Link href="/esports-jobs-australia" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all text-center">
              <span className="text-2xl">🇦🇺</span>
              <span className="text-white font-medium ml-2">Australia</span>
            </Link>
            <Link href="/esports-jobs-saudi-arabia" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all text-center">
              <span className="text-2xl">🇸🇦</span>
              <span className="text-white font-medium ml-2">Saudi Arabia</span>
            </Link>
            <Link href="/esports-jobs-dubai" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all text-center">
              <span className="text-2xl">🇦🇪</span>
              <span className="text-white font-medium ml-2">Dubai</span>
            </Link>
            <Link href="/esports-jobs-sweden" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all text-center">
              <span className="text-2xl">🇸🇪</span>
              <span className="text-white font-medium ml-2">Sweden</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link href="/esports-jobs-los-angeles" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">Los Angeles</span>
            </Link>
            <Link href="/esports-jobs-london" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">London</span>
            </Link>
            <Link href="/esports-jobs-berlin" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">Berlin</span>
            </Link>
            <Link href="/esports-jobs-new-york" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">New York</span>
            </Link>
            <Link href="/esports-jobs-seoul" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">Seoul</span>
            </Link>
            <Link href="/esports-jobs-remote" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all text-center">
              <span className="text-green-400 text-sm">🌍 Remote</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Browse by Role - Internal Linking */}
      <section className="py-20 bg-[#0d0d15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Browse <span className="text-purple-400">Esports Jobs</span> by Role
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            <Link href="/esports-coach-careers" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
              <span className="text-white font-medium">Coach Jobs</span>
              <p className="text-gray-400 text-sm mt-1">Train professional players</p>
            </Link>
            <Link href="/esports-analyst-careers" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all">
              <span className="text-white font-medium">Analyst Jobs</span>
              <p className="text-gray-400 text-sm mt-1">Data and performance analysis</p>
            </Link>
            <Link href="/esports-broadcaster-careers" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all">
              <span className="text-white font-medium">Broadcaster Jobs</span>
              <p className="text-gray-400 text-sm mt-1">Casting and on-air talent</p>
            </Link>
            <Link href="/esports-marketing-careers" className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-pink-500/50 transition-all">
              <span className="text-white font-medium">Marketing Jobs</span>
              <p className="text-gray-400 text-sm mt-1">Brand and marketing roles</p>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Link href="/entry-level-esports-jobs-uk" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">Entry Level</span>
            </Link>
            <Link href="/esports-salary-guide-uk" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">UK Salaries</span>
            </Link>
            <Link href="/esports-salary-guide-usa" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-green-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">USA Salaries</span>
            </Link>
            <Link href="/how-to-get-into-esports" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">How to Get In</span>
            </Link>
            <Link href="/esports-lecturer-jobs" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">Lecturer Jobs</span>
            </Link>
            <Link href="/gaming-tester-jobs-uk" className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all text-center">
              <span className="text-gray-300 text-sm">QA Tester Jobs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Post Your Esports Job</h2>
          <p className="text-gray-300 mb-6">
            Have an esports job opening? Get it featured on the leading esports jobs board.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg transition-all"
          >
            Post an Esports Job
            <span>→</span>
          </Link>
        </div>
      </section>

      <UnifiedFooter activeSite="jobs" />
    </main>
  );
}

// Job Card Component with Hero Image - Links to internal job page
function JobCard({ job }: { job: EsportsJob }) {
  return (
    <Link
      href={`/job/${job.id}`}
      className="bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-colors border border-gray-800 hover:border-cyan-500/50 group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Hero Image */}
        <div className="relative w-full md:w-48 h-32 md:h-auto flex-shrink-0">
          <img
            src={job.heroImage}
            alt={job.heroImageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/80 md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent md:hidden" />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                {job.title}
              </h3>
              <span
                className={`px-2 py-0.5 text-xs rounded border ${
                  job.type === "Full-time"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                    : job.type === "Part-time"
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                    : job.type === "Intern"
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-amber-500/20 border-amber-500/50 text-amber-400"
                }`}
              >
                {job.type}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mb-2">
              <span className="font-medium text-cyan-400">{job.company}</span>
              <span>📍 {job.location}</span>
              <span>💰 {job.salary}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="bg-cyan-500 group-hover:bg-cyan-400 text-black font-bold py-2 px-5 rounded transition-all inline-block">
              View Job →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
