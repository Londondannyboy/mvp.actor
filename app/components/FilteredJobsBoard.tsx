"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { EsportsJob, esportsJobs, getAllCategories } from "../../lib/jobs-data";

// Filter type for job categories
type FilterType = "qa" | "designer" | "developer" | "artist" | "producer" | "entry-level" | null;

// Filter functions defined inside client component
const filterFunctions: Record<string, (job: EsportsJob) => boolean> = {
  qa: (job: EsportsJob): boolean => {
    const title = job.title.toLowerCase();
    const description = job.description?.toLowerCase() || "";
    const skills = job.skills.map(s => s.toLowerCase()).join(" ");
    return (
      title.includes("qa") || title.includes("test") || title.includes("quality") ||
      description.includes("qa ") || description.includes("testing") ||
      skills.includes("qa") || skills.includes("testing")
    );
  },
  designer: (job: EsportsJob): boolean => {
    const title = job.title.toLowerCase();
    return (
      title.includes("design") ||
      title.includes("level design") ||
      title.includes("game design") ||
      title.includes("ux") ||
      title.includes("ui")
    );
  },
  developer: (job: EsportsJob): boolean => {
    const title = job.title.toLowerCase();
    return (
      title.includes("develop") ||
      title.includes("engineer") ||
      title.includes("programmer") ||
      title.includes("software") ||
      title.includes("frontend") ||
      title.includes("backend") ||
      title.includes("full stack") ||
      title.includes("technical")
    );
  },
  artist: (job: EsportsJob): boolean => {
    const title = job.title.toLowerCase();
    return (
      title.includes("artist") ||
      title.includes("animator") ||
      title.includes("animation") ||
      title.includes("3d") ||
      title.includes("2d") ||
      title.includes("vfx") ||
      title.includes("concept")
    );
  },
  producer: (job: EsportsJob): boolean => {
    const title = job.title.toLowerCase();
    const category = job.category.toLowerCase();
    return (
      title.includes("produc") ||
      title.includes("project manager") ||
      title.includes("scrum") ||
      category === "production"
    );
  },
  "entry-level": (job: EsportsJob): boolean => {
    const title = job.title.toLowerCase();
    const description = job.description?.toLowerCase() || "";
    return (
      title.includes("junior") ||
      title.includes("entry") ||
      title.includes("associate") ||
      title.includes("intern") ||
      title.includes("graduate") ||
      job.type === "Intern" ||
      description.includes("entry level") ||
      description.includes("entry-level") ||
      description.includes("no experience required") ||
      description.includes("0-2 years")
    );
  },
};

interface FilteredJobsBoardProps {
  /** Type of filter to apply (qa, designer, developer, artist, producer, entry-level) */
  filterType?: FilterType;
  /** Label for the filtered section (e.g., "Game Tester Jobs") */
  filteredSectionTitle?: string;
  /** Label for all jobs section */
  allJobsSectionTitle?: string;
  /** Accent color for UI elements */
  accentColor?: "cyan" | "green" | "purple" | "pink" | "amber" | "emerald" | "violet";
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Show category filters */
  showCategoryFilters?: boolean;
  /** Base URL for links (for canonical purposes) */
  baseUrl?: string;
}

const categoryColors: Record<string, string> = {
  coaching: "bg-green-500/20 border-green-500/50 text-green-400",
  marketing: "bg-purple-500/20 border-purple-500/50 text-purple-400",
  production: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
  management: "bg-amber-500/20 border-amber-500/50 text-amber-400",
  content: "bg-pink-500/20 border-pink-500/50 text-pink-400",
  operations: "bg-blue-500/20 border-blue-500/50 text-blue-400",
};

const accentColors = {
  cyan: {
    button: "bg-cyan-500 hover:bg-cyan-400 text-black",
    badge: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
    border: "border-cyan-500/50",
    text: "text-cyan-400",
    gradient: "from-cyan-500 to-blue-500",
  },
  green: {
    button: "bg-green-500 hover:bg-green-400 text-black",
    badge: "bg-green-500/20 border-green-500/50 text-green-400",
    border: "border-green-500/50",
    text: "text-green-400",
    gradient: "from-green-500 to-emerald-500",
  },
  purple: {
    button: "bg-purple-500 hover:bg-purple-400 text-white",
    badge: "bg-purple-500/20 border-purple-500/50 text-purple-400",
    border: "border-purple-500/50",
    text: "text-purple-400",
    gradient: "from-purple-500 to-violet-500",
  },
  pink: {
    button: "bg-pink-500 hover:bg-pink-400 text-white",
    badge: "bg-pink-500/20 border-pink-500/50 text-pink-400",
    border: "border-pink-500/50",
    text: "text-pink-400",
    gradient: "from-pink-500 to-rose-500",
  },
  amber: {
    button: "bg-amber-500 hover:bg-amber-400 text-black",
    badge: "bg-amber-500/20 border-amber-500/50 text-amber-400",
    border: "border-amber-500/50",
    text: "text-amber-400",
    gradient: "from-amber-500 to-orange-500",
  },
  emerald: {
    button: "bg-emerald-500 hover:bg-emerald-400 text-black",
    badge: "bg-emerald-500/20 border-emerald-500/50 text-emerald-400",
    border: "border-emerald-500/50",
    text: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
  },
  violet: {
    button: "bg-violet-500 hover:bg-violet-400 text-white",
    badge: "bg-violet-500/20 border-violet-500/50 text-violet-400",
    border: "border-violet-500/50",
    text: "text-violet-400",
    gradient: "from-violet-500 to-purple-500",
  },
};

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

export function FilteredJobsBoard({
  filterType,
  filteredSectionTitle = "Featured Jobs",
  allJobsSectionTitle = "All Gaming Jobs",
  accentColor = "cyan",
  searchPlaceholder = "Search jobs...",
  showCategoryFilters = true,
  baseUrl = "/esports-jobs",
}: FilteredJobsBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const colors = accentColors[accentColor];
  const categories = getAllCategories();

  // Get the filter function based on filterType
  const filterFn = filterType ? filterFunctions[filterType] : null;

  // Apply all filters
  const { filteredJobs, otherJobs } = useMemo(() => {
    let jobs = esportsJobs;

    // Apply search
    if (searchQuery) {
      jobs = searchJobs(jobs, searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      jobs = jobs.filter((job) => job.category === selectedCategory);
    }

    // Split into filtered (matching page type) and others
    if (filterFn) {
      const filtered = jobs.filter(filterFn);
      const other = jobs.filter((job) => !filterFn(job));
      return { filteredJobs: filtered, otherJobs: other };
    }

    return { filteredJobs: [], otherJobs: jobs };
  }, [searchQuery, selectedCategory, filterFn]);

  const totalCount = filterFn ? filteredJobs.length + otherJobs.length : otherJobs.length;
  const isSearching = searchQuery.length > 0 || selectedCategory !== null;

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 px-6 py-4 rounded-lg bg-slate-900/80 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
          <button
            onClick={() => setSearchQuery("")}
            className={`${colors.button} font-bold py-4 px-8 rounded-lg transition-all`}
          >
            {searchQuery ? "Clear" : "Search"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="text-center">
        <span className={`inline-block px-4 py-2 rounded-full ${colors.badge} border text-sm font-medium`}>
          {totalCount} jobs {isSearching ? "found" : "available"}
        </span>
        {isSearching && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className={`ml-4 ${colors.text} hover:underline text-sm`}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Category Filters */}
      {showCategoryFilters && (
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
              !selectedCategory
                ? colors.badge + " border"
                : "bg-slate-800/50 border-slate-700 text-slate-400"
            }`}
          >
            All ({esportsJobs.length})
          </button>
          {categories.map((category) => {
            const count = esportsJobs.filter((j) => j.category === category).length;
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(isActive ? null : category)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105 ${
                  isActive ? categoryColors[category] : "bg-slate-800/50 border-slate-700 text-slate-400"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {totalCount === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold text-white mb-4">No Jobs Found</h3>
          <p className="text-slate-400 mb-6">
            Try adjusting your search or filters to find more opportunities.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }}
            className={`${colors.button} font-bold py-3 px-6 rounded-lg transition-all`}
          >
            View All Jobs
          </button>
        </div>
      )}

      {/* Filtered Jobs Section (Role-specific) */}
      {filterFn && filteredJobs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredSectionTitle}
              <span className="text-slate-400 text-lg font-normal ml-3">
                ({filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"})
              </span>
            </h2>
          </div>
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} accentColor={accentColor} />
            ))}
          </div>
        </section>
      )}

      {/* All Other Jobs Section */}
      {otherJobs.length > 0 && (
        <section className={filterFn && filteredJobs.length > 0 ? "pt-8 border-t border-slate-800" : ""}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filterFn && filteredJobs.length > 0 ? allJobsSectionTitle : "All Jobs"}
              <span className="text-slate-400 text-lg font-normal ml-3">
                ({otherJobs.length} {otherJobs.length === 1 ? "job" : "jobs"})
              </span>
            </h2>
            <Link href={baseUrl} className={`${colors.text} hover:underline font-medium hidden md:block`}>
              View all on main board →
            </Link>
          </div>
          <div className="grid gap-4">
            {otherJobs.map((job) => (
              <JobCard key={job.id} job={job} accentColor={accentColor} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="text-center pt-8">
        <Link
          href={baseUrl}
          className={`inline-block px-8 py-3 ${colors.button} font-bold rounded-lg transition-all`}
        >
          View Full Job Board
        </Link>
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({ job, accentColor = "cyan" }: { job: EsportsJob; accentColor?: string }) {
  const colors = accentColors[accentColor as keyof typeof accentColors] || accentColors.cyan;

  return (
    <Link
      href={`/job/${job.id}`}
      className={`bg-slate-900/50 rounded-xl overflow-hidden hover:bg-slate-800/50 transition-colors border border-slate-800 hover:${colors.border} group`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Hero Image */}
        <div className="relative w-full md:w-48 h-32 md:h-auto flex-shrink-0">
          <Image
            src={job.heroImage}
            alt={job.heroImageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80 md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent md:hidden" />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className={`text-lg font-bold text-white group-hover:${colors.text} transition-colors`}>
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
            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-sm mb-2">
              <span className={`font-medium ${colors.text}`}>{job.company}</span>
              <span>{job.location}</span>
              {job.salary && <span>{job.salary}</span>}
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
            <span className={`${colors.button} font-bold py-2 px-5 rounded transition-all inline-block`}>
              View Job →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FilteredJobsBoard;
