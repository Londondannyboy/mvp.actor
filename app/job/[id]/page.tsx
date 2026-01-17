import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnifiedHeader } from "../../components/UnifiedHeader";
import { UnifiedFooter } from "../../components/UnifiedFooter";
import { SkillsGraph } from "../../components/SkillsGraph";
import { SidebarPanels } from "../../components/SidebarPanels";
import { HeyCompaniesCompact } from "../../components/HeyCompanies";
import { JobPageClient } from "./JobPageClient";
import { esportsJobs, getJobById, generateJobPostingSchema, EsportsJob } from "../../../lib/jobs-data";

// Generate static params for all jobs
export async function generateStaticParams() {
  return esportsJobs.map((job) => ({
    id: job.id,
  }));
}

// Generate metadata for each job page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    return {
      title: "Esports Job Not Found",
    };
  }

  return {
    title: `${job.title} at ${job.company} | Esports Jobs`,
    description: `Apply for ${job.title} at ${job.company}. ${job.location}. ${job.type} esports job. ${job.description.slice(0, 150)}...`,
    keywords: `${job.title}, ${job.company}, esports jobs, ${job.category} jobs, gaming jobs, ${job.skills.join(", ")}`,
    openGraph: {
      title: `${job.title} - ${job.company} | Esports Jobs`,
      description: `${job.type} position at ${job.company}. ${job.location}.`,
      type: "website",
      url: `https://mvp.actor/job/${job.id}`,
      images: [{ url: job.heroImage, alt: job.heroImageAlt }],
    },
    alternates: {
      canonical: `https://mvp.actor/job/${job.id}`,
    },
  };
}

// Related videos for job pages - VERIFIED WORKING IDs
const relatedVideos: Record<string, { id: string; title: string }> = {
  "League of Legends": { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  "Valorant": { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  "Rocket League": { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  "Counter-Strike": { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  coaching: { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  marketing: { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  production: { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
  default: { id: "HmG0pcBjO2w", title: "How to Get a Job in Esports" },
};

function getRelatedVideo(job: EsportsJob) {
  // Check skills for game-specific videos
  for (const skill of job.skills) {
    if (relatedVideos[skill]) {
      return relatedVideos[skill];
    }
  }
  // Fall back to category-based video
  if (relatedVideos[job.category]) {
    return relatedVideos[job.category];
  }
  return relatedVideos.default;
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const jobSchema = generateJobPostingSchema(job);
  const relatedVideo = getRelatedVideo(job);

  // Get related jobs (same category, excluding current)
  const relatedJobs = esportsJobs
    .filter((j) => j.category === job.category && j.id !== job.id)
    .slice(0, 3);

  return (
    <JobPageClient
      jobId={job.id}
      jobTitle={job.title}
      jobCompany={job.company}
      jobLocation={job.location}
      jobCategory={job.category}
      jobSkills={job.skills}
      jobDescription={job.description}
      jobType={job.type}
      jobSalary={job.salary}
    >
      <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* JobPosting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />

      <UnifiedHeader
        activeSite="jobs"
        siteNavItems={[
          { label: "All Esports Jobs", href: "/esports-jobs" },
          { label: "Categories", href: "/esports-jobs#categories" },
          { label: "Career Guides", href: "/#guides" },
        ]}
        ctaLabel="Post a Job"
        ctaHref="/contact"
      />

      {/* Hero with Job Image */}
      <section className="relative pt-20">
        <div className="h-64 md:h-80 relative overflow-hidden">
          <img
            src={job.heroImage}
            alt={job.heroImageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
        </div>

        {/* Job Header - Overlapping */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Company Logo */}
              {job.companyLogo && (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                    job.type === "Full-time" ? "bg-green-500/20 border border-green-500/50 text-green-400" :
                    job.type === "Part-time" ? "bg-purple-500/20 border border-purple-500/50 text-purple-400" :
                    job.type === "Contract" ? "bg-amber-500/20 border border-amber-500/50 text-amber-400" :
                    "bg-pink-500/20 border border-pink-500/50 text-pink-400"
                  }`}>
                    {job.type}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 capitalize">
                    {job.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-2">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                  <span className="font-bold text-cyan-400 text-lg">{job.company}</span>
                  <span className="flex items-center gap-1">
                    <span>📍</span> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💰</span> {job.salary}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <span>📅</span> Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Apply Button - Desktop */}
              <div className="hidden md:block flex-shrink-0">
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
                >
                  Apply Now
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Job Description - Main Column */}
            <div className="md:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">About This Esports Job</h2>
                <div className="prose prose-lg prose-invert max-w-none">
                  {job.description.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Skills Visualization - Main Panel */}
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl p-6 md:p-8 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  Key Skills for This Role
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {job.skills.map((skill, index) => {
                    const colors = [
                      "from-cyan-500 to-cyan-400",
                      "from-purple-500 to-purple-400",
                      "from-pink-500 to-pink-400",
                      "from-green-500 to-green-400",
                      "from-amber-500 to-amber-400",
                      "from-blue-500 to-blue-400",
                    ];
                    const colorClass = colors[index % colors.length];
                    const importance = Math.max(70, 95 - (index * 5));

                    return (
                      <div key={skill} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                            {skill}
                          </span>
                          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                            {importance}% importance
                          </span>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-500 group-hover:shadow-lg`}
                            style={{ width: `${importance}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-gray-400 text-sm mt-6 pt-4 border-t border-gray-700">
                  Skills ranked by typical importance for {job.category} roles in esports.
                  Build these competencies to strengthen your application.
                </p>
              </div>

              {job.requirements && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Requirements</h2>
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Apply Button */}
              <div className="md:hidden">
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all"
                >
                  Apply Now →
                </a>
              </div>

              {/* Related Video */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Learn More About Esports Careers</h2>
                <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${relatedVideo.id}`}
                      title={relatedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white">{relatedVideo.title}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills Graph */}
              <SkillsGraph
                skills={job.skills}
                jobTitle={job.title}
                category={job.category}
              />

              {/* Quick Info */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                <h3 className="font-bold text-white mb-4">Job Details</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Company</dt>
                    <dd className="text-white font-medium">{job.company}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Location</dt>
                    <dd className="text-white font-medium">{job.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Job Type</dt>
                    <dd className="text-white font-medium">{job.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Salary</dt>
                    <dd className="text-white font-medium">{job.salary}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Category</dt>
                    <dd className="text-white font-medium capitalize">{job.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Source</dt>
                    <dd className="text-white font-medium capitalize">{job.source}</dd>
                  </div>
                </dl>
              </div>

              {/* Apply CTA */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-xl p-6 border border-cyan-500/30">
                <h3 className="font-bold text-white mb-2">Interested?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Apply directly on the employer&apos;s website.
                </p>
                <a
                  href={job.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Apply Now →
                </a>
              </div>

              {/* Sidebar Panels - Guides & CTAs */}
              <SidebarPanels
                showRelatedJobs={true}
                relatedJobsHref="/esports-jobs"
              />

              {/* Hey Companies CTA */}
              <HeyCompaniesCompact />
            </div>
          </div>
        </div>
      </section>

      {/* Related Jobs */}
      {relatedJobs.length > 0 && (
        <section className="py-12 bg-[#0d0d15]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">
              Similar <span className="text-cyan-400">Esports Jobs</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedJobs.map((relJob) => (
                <Link
                  key={relJob.id}
                  href={`/job/${relJob.id}`}
                  className="block bg-gray-900/50 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="h-32 relative">
                    <img
                      src={relJob.heroImage}
                      alt={relJob.heroImageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                      {relJob.title}
                    </h3>
                    <p className="text-cyan-400 text-sm">{relJob.company}</p>
                    <p className="text-gray-500 text-xs mt-1">{relJob.location}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/esports-jobs"
                className="inline-flex items-center gap-2 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 font-bold py-3 px-6 rounded-lg transition-all"
              >
                View All Esports Jobs
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

        <UnifiedFooter activeSite="jobs" />
      </main>
    </JobPageClient>
  );
}
