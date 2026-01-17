// Real esports jobs aggregated from public sources
// Last updated: December 2024

export interface EsportsJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  heroImage: string;
  heroImageAlt: string;
  location: string;
  country: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  salary?: string;
  description: string;
  requirements?: string;
  skills: string[];
  postedDate: string;
  validThrough?: string;
  externalUrl: string;
  source: 'linkedin' | 'workday' | 'company-site';
  category: 'coaching' | 'marketing' | 'production' | 'management' | 'content' | 'operations';
  // MDX content for rich job displays with CopilotKit graphs and graphics
  mdx?: string;
}

// Unique hero images for each job from Unsplash and Pexels
// Optimized: w=400 for mobile, fm=webp for Unsplash, auto=compress for Pexels
const uniqueHeroImages = {
  logitechMarketing: {
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=75&fm=webp',
    alt: 'Esports arena with neon lights and gaming atmosphere'
  },
  octagonManagement: {
    url: 'https://images.pexels.com/photos/7862657/pexels-photo-7862657.jpeg?w=400&auto=compress',
    alt: 'Esports tournament with professional players competing'
  },
  teamLiquidProduction: {
    url: 'https://images.pexels.com/photos/9072216/pexels-photo-9072216.jpeg?w=400&auto=compress',
    alt: 'Professional gaming room setup with multiple monitors'
  },
  garenaIntern: {
    url: 'https://images.pexels.com/photos/3977908/pexels-photo-3977908.jpeg?w=400&auto=compress',
    alt: 'Professional gamer focused on competitive gameplay'
  },
  idahoFallsCoach: {
    url: 'https://images.unsplash.com/photo-1558008258-7ff8888b42b0?w=400&q=75&fm=webp',
    alt: 'Esports team strategy session and coaching'
  },
  camdenCoach: {
    url: 'https://images.pexels.com/photos/7849510/pexels-photo-7849510.jpeg?w=400&auto=compress',
    alt: 'Gaming arena with players at workstations'
  },
  walledLakeCoach: {
    url: 'https://images.pexels.com/photos/9071735/pexels-photo-9071735.jpeg?w=400&auto=compress',
    alt: 'Gamer in neon-lit competitive gaming environment'
  },
  ntcOperations: {
    url: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?w=400&auto=compress',
    alt: 'Gaming gear and equipment setup'
  },
  gcuDJ: {
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=75&fm=webp',
    alt: 'Gaming event atmosphere with vibrant lighting'
  },
  gcuVideographer: {
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=75&fm=webp',
    alt: 'Content creation and video production setup'
  },
  carrollCoach: {
    url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&q=75&fm=webp',
    alt: 'Gaming controller and esports equipment'
  },
};

// Filter and curate real esports jobs
export const esportsJobs: EsportsJob[] = [
  {
    id: 'logitech-esports-partnership-marketing-manager',
    title: 'Esports & Partnership Marketing Manager',
    company: 'Logitech',
    heroImage: uniqueHeroImages.logitechMarketing.url,
    heroImageAlt: uniqueHeroImages.logitechMarketing.alt,
    location: 'London, UK / Barcelona / Paris',
    country: 'United Kingdom',
    type: 'Full-time',
    salary: 'Competitive',
    validThrough: '2025-02-28',
    description: `Logitech G is looking for an Esports & Partnership Manager to be instrumental in the development and execution of our esports strategy. You will help make Logitech G the gear of choice for professional gamers, engage with esports athletes & fans worldwide and help develop content and programs for Europe.

You will be part of a committed group of gamers and professionals who develop ideas and content to drive advocacy and adoption for Logitech G, one of the top brands in the gaming industry.`,
    requirements: `Experience developing marketing programs from inception through execution. 3+ years experience in esports or other sports marketing roles in game publishers or esports related companies. Deep understanding of esports and how to build effective gaming communications. Strong networking, organizational and program management skills.`,
    skills: ['Esports Marketing', 'Partnership Development', 'Project Management', 'Campaign Execution', 'Event Planning'],
    postedDate: '2024-12-18',
    externalUrl: 'https://logitech.wd5.myworkdayjobs.com/Logitech/job/London-United-Kingdom/Esports---Partnership-Marketing-Manager_143205',
    source: 'workday',
    category: 'marketing',
  },
  {
    id: 'octagon-account-director-esports-apac',
    title: 'Account Director (eSports, APAC)',
    company: 'Octagon',
    heroImage: uniqueHeroImages.octagonManagement.url,
    heroImageAlt: uniqueHeroImages.octagonManagement.alt,
    location: 'Singapore',
    country: 'Singapore',
    type: 'Full-time',
    salary: 'Competitive',
    validThrough: '2025-02-28',
    description: `As an Account Director focused on eSports for the APAC region, you will support our Global eSports team as the primary representative and liaison for all APAC clients. In this pivotal role, you will shape Octagon's presence in the APAC eSports market, driving innovation and expansion opportunities that position our agency as an industry leader.

You will act as the regional eSports expert, lead and execute projects across APAC, foster new business growth, and serve as the main point of contact for all APAC client stakeholders.`,
    requirements: `6-10 years of agency or client servicing experience, ideally in sponsorship and partnerships. Deep knowledge and practical experience in the eSports & Gaming industry. Comfortable working in a dynamic, global environment across time zones.`,
    skills: ['Client Servicing', 'Strategic Thinking', 'Project Management', 'eSports Knowledge', 'Event Management'],
    postedDate: '2024-12-23',
    externalUrl: 'https://sg.linkedin.com/jobs/view/account-director-esports-apac-at-octagon-4346081296',
    source: 'linkedin',
    category: 'management',
  },
  {
    id: 'team-liquid-esports-video-producer',
    title: 'Esports Video Producer',
    company: 'Team Liquid',
    companyLogo: 'https://media.licdn.com/dms/image/v2/D4D0BAQGhAkbpkPdFmg/company-logo_200_200/B4DZd31MfqGYAI-/0/1750062123499/teamliquid_enterprises_llc_logo',
    heroImage: uniqueHeroImages.teamLiquidProduction.url,
    heroImageAlt: uniqueHeroImages.teamLiquidProduction.alt,
    location: 'Jakarta, Indonesia',
    country: 'Indonesia',
    type: 'Full-time',
    salary: 'Competitive',
    validThrough: '2025-02-28',
    description: `Join Team Liquid Indonesia as an Esports Producer! The Producer is accountable for conceptualizing, planning, and overseeing the production of engaging video content for Team Liquid Indonesia.

This role focuses on guiding the creative vision, managing a high-performing production team, and ensuring content aligns with brand goals while meeting quality standards and resource constraints.`,
    requirements: `Extensive experience in a production role, preferably in content creation or media. Proven track record of managing large-scale production projects and overseeing high-performing teams. Strong organizational and team management skills.`,
    skills: ['Video Production', 'Project Management', 'Team Management', 'Content Creation', 'Creative Vision'],
    postedDate: '2024-12-22',
    externalUrl: 'https://id.linkedin.com/jobs/view/esports-video-producer-at-team-liquid-4345840543',
    source: 'linkedin',
    category: 'production',
  },
  {
    id: 'garena-esports-marketing-collaborator',
    title: 'Esports Marketing Collaborator (Video Editing)',
    company: 'Garena',
    companyLogo: 'https://media.licdn.com/dms/image/v2/D560BAQF_8riz05Y-iw/company-logo_200_200/company-logo_200_200/0/1694418241019/garena_logo',
    heroImage: uniqueHeroImages.garenaIntern.url,
    heroImageAlt: uniqueHeroImages.garenaIntern.alt,
    location: 'Hanoi, Vietnam',
    country: 'Vietnam',
    type: 'Intern',
    salary: 'Competitive',
    validThrough: '2025-02-28',
    description: `Join Garena Arena of Valor (Liên Quân Mobile) as an Esports Marketing Collaborator! This is an opportunity to gain real experience in Marketing within the esports industry.

You will work on live streaming and editing highlight videos during professional tournaments, and support the development of communication plans for the tournament system.`,
    requirements: `Final-year students or recent graduates. Strong understanding of Liên Quân Mobile and its tournaments. Video editing skills using tools like Canva, TikTok, Capcut, or Adobe Creative Cloud.`,
    skills: ['Video Editing', 'Esports Marketing', 'Social Media', 'Creative Content', 'Event Planning'],
    postedDate: '2024-12-23',
    externalUrl: 'https://vn.linkedin.com/jobs/view/hn-li%C3%AAn-qu%C3%A2n-mobile-c%E1%BB%99ng-t%C3%A1c-vi%C3%AAn-esports-marketing-video-editing-at-garena-4345848474',
    source: 'linkedin',
    category: 'marketing',
  },
  {
    id: 'idaho-falls-esports-assistant-coach-1',
    title: 'Esports Assistant Coach',
    company: 'Idaho Falls School District 91',
    companyLogo: 'https://media.licdn.com/dms/image/v2/C560BAQHv-m9efzdblA/company-logo_200_200/company-logo_200_200/0/1677954047445/idaho_falls_school_district_91_logo',
    heroImage: uniqueHeroImages.idahoFallsCoach.url,
    heroImageAlt: uniqueHeroImages.idahoFallsCoach.alt,
    location: 'Idaho Falls, Idaho, USA',
    country: 'United States',
    type: 'Full-time',
    salary: 'Per stipend schedule',
    validThrough: '2025-02-28',
    description: `Support the delivery of School District 91's mission to provide students with diverse and meaningful extracurricular opportunities that foster teamwork, leadership, and digital citizenship.

Assist the Head Coach in developing an inclusive, competitive esports program that helps each participating student grow in skill, discipline, sportsmanship, and self-confidence.`,
    requirements: `Demonstrates skill, experience, or a strong understanding of competitive gaming, team coordination, and esports culture. Experience working with students in a coaching, mentoring, or instructional role preferred. Knowledge of esports titles sanctioned by the district (e.g., Rocket League, League of Legends, Super Smash Bros.).`,
    skills: ['Coaching', 'Team Coordination', 'Esports Culture', 'Mentoring', 'Player Development'],
    postedDate: '2024-12-28',
    externalUrl: 'https://www.linkedin.com/jobs/view/esports-assistant-coach-at-idaho-falls-school-district-91-4346541128',
    source: 'linkedin',
    category: 'coaching',
  },
  {
    id: 'camden-county-assistant-esports-coach',
    title: 'Assistant Esports Coach',
    company: 'Camden County College',
    companyLogo: 'https://media.licdn.com/dms/image/v2/C560BAQEzMQJzEGSxcw/company-logo_200_200/company-logo_200_200/0/1631321674574',
    heroImage: uniqueHeroImages.camdenCoach.url,
    heroImageAlt: uniqueHeroImages.camdenCoach.alt,
    location: 'Camden, New Jersey, USA',
    country: 'United States',
    type: 'Part-time',
    salary: '$15.49/hour',
    validThrough: '2025-02-28',
    description: `The Assistant Esports Coach will help develop/grow the Esports program and provide additional support to student-athletes at Camden County College.

Perform in-game coaching, teaching, and instruction from the Esports arena. Assist the coaching staff in implementing and crafting new in-game strategies, managing practices, and coordinating intercollegiate matches.`,
    requirements: `Strong knowledge and coaching ability in one or more esports titles: Counter-Strike: Global Offensive, Valorant, League of Legends, Rocket League, or Super Smash Brothers Ultimate. Familiarity with streaming platforms (Twitch, YouTube) and streaming software. Ability to work with a diverse student population.`,
    skills: ['Coaching', 'Valorant', 'League of Legends', 'Rocket League', 'Streaming'],
    postedDate: '2024-12-27',
    externalUrl: 'https://www.linkedin.com/jobs/view/assistant-esports-coach-temporary-part-time-at-camden-county-college-4329502021',
    source: 'linkedin',
    category: 'coaching',
  },
  {
    id: 'walled-lake-esports-assistant-coach',
    title: 'Esports Assistant Coach',
    company: 'Walled Lake Consolidated Schools',
    companyLogo: 'https://media.licdn.com/dms/image/v2/C4D0BAQFdCsR2jI8kGg/company-logo_200_200/company-logo_200_200/0/1668102923546/walled_lake_consolidated_schools_logo',
    heroImage: uniqueHeroImages.walledLakeCoach.url,
    heroImageAlt: uniqueHeroImages.walledLakeCoach.alt,
    location: 'Walled Lake, Michigan, USA',
    country: 'United States',
    type: 'Full-time',
    salary: 'Per district schedule',
    validThrough: '2025-02-28',
    description: `The Esports Assistant Coach will support the head coach in training and developing the esports team. Responsibilities include assisting with strategy development and player performance analysis.`,
    requirements: `Experience in coaching or competitive gaming. Strong communication and leadership skills are essential for this role.`,
    skills: ['Coaching', 'Team Management', 'Strategy Development', 'Game Analysis', 'Player Development'],
    postedDate: '2024-12-24',
    externalUrl: 'https://www.linkedin.com/jobs/view/esports-assistant-coach-at-walled-lake-consolidated-schools-4346171397',
    source: 'linkedin',
    category: 'coaching',
  },
  {
    id: 'ntc-esports-assistant',
    title: 'Esports Assistant (Work-Study)',
    company: 'Northcentral Technical College',
    heroImage: uniqueHeroImages.ntcOperations.url,
    heroImageAlt: uniqueHeroImages.ntcOperations.alt,
    location: 'Wausau, Wisconsin, USA',
    country: 'United States',
    type: 'Part-time',
    salary: '$14.00/hour',
    validThrough: '2025-02-28',
    description: `This is a paid position through work-study or student employment that allows students to grow in leadership, professional and soft skills. The position is responsible for monitoring all activity within the NTC Esports arena during assigned shifts.

Keep NTC's Esports arena clean, tidy and presentable at all times. Assist with events and programming within the arena. Assist with creating social media content for NTC Esports.`,
    requirements: `Must be an active student enrolled in at least 6 credits. Knowledge of games including Overwatch, League of Legends and Rocket League. Ability to work independently. Strong service-oriented skills and exceptional customer service attitude.`,
    skills: ['Customer Service', 'Social Media', 'Event Assistance', 'Gaming Knowledge', 'Arena Management'],
    postedDate: '2024-12-19',
    externalUrl: 'https://ntc.wd1.myworkdayjobs.com/NTCStudent/job/Wausau-Main-Campus/Work-Study-Student---Esports-Assistant_JR787',
    source: 'workday',
    category: 'operations',
  },
  {
    id: 'gcu-gameday-dj-esports',
    title: 'Gameday DJ - Esports',
    company: 'Grand Canyon University',
    heroImage: uniqueHeroImages.gcuDJ.url,
    heroImageAlt: uniqueHeroImages.gcuDJ.alt,
    location: 'Phoenix, Arizona, USA',
    country: 'United States',
    type: 'Part-time',
    salary: 'Minimum Wage',
    validThrough: '2025-02-28',
    description: `GCU Esports is seeking an experienced and energetic Student Worker DJ to provide live music and atmosphere for weekly Wednesday night esports competitions and special events.

Perform live DJ sets during GCU Esports events, curating music that matches the energy and pacing of competitive gameplay. Set up, operate, and break down DJ equipment before and after each event.`,
    requirements: `Must be current GCU student in good academic standing. Prior DJ experience required, preferably in live event, sports, or esports settings. Must own reliable DJ equipment and be able to transport it.`,
    skills: ['DJ Experience', 'Music Selection', 'Event Coordination', 'Esports Knowledge', 'Live Production'],
    postedDate: '2024-12-16',
    externalUrl: 'https://gcu.wd1.myworkdayjobs.com/GCUC/job/AZ-Phoenix/Gameday-DJ---Esports--FWS---NFWS-_R000064517',
    source: 'workday',
    category: 'production',
  },
  {
    id: 'gcu-esports-videographer',
    title: 'Esports Videographer',
    company: 'Grand Canyon University',
    heroImage: uniqueHeroImages.gcuVideographer.url,
    heroImageAlt: uniqueHeroImages.gcuVideographer.alt,
    location: 'Phoenix, Arizona, USA',
    country: 'United States',
    type: 'Part-time',
    salary: 'Minimum Wage',
    validThrough: '2025-02-28',
    description: `Provide creative and technical video production support for GCU Esports events, content creation, and marketing initiatives. The Esports Videographer will capture, edit, and deliver high-quality video content to showcase competitive teams, community events, and facility activities.

Record live GCU Esports events, tournaments, and team activities. Edit footage into highlight reels, promotional videos, and recap content.`,
    requirements: `Currently enrolled GCU student in good academic standing. Experience with video production equipment and editing software (Adobe Premiere Pro, Final Cut, DaVinci Resolve). Knowledge of esports and gaming culture preferred.`,
    skills: ['Video Production', 'Adobe Premiere Pro', 'Live Event Production', 'Content Creation', 'Editing'],
    postedDate: '2024-12-10',
    externalUrl: 'https://gcu.wd1.myworkdayjobs.com/GCUI/job/AZ-Phoenix/Esports-Videographer--FWS-NFWS-_R000064454',
    source: 'workday',
    category: 'content',
  },
  {
    id: 'carroll-county-assistant-esports-coach',
    title: 'Assistant ESports Coach',
    company: 'Carroll County Schools',
    companyLogo: 'https://media.licdn.com/dms/image/v2/C4D0BAQFOSgxNFsOTNQ/company-logo_200_200/company-logo_200_200/0/1644328238362/carroll_county_schools_logo',
    heroImage: uniqueHeroImages.carrollCoach.url,
    heroImageAlt: uniqueHeroImages.carrollCoach.alt,
    location: 'Carrollton, Kentucky, USA',
    country: 'United States',
    type: 'Part-time',
    salary: '$1,200/year',
    validThrough: '2025-02-28',
    description: `The Assistant ESports Coach will support the head coach in managing the ESports team at Carroll County High School. Responsibilities include assisting with training, strategy development, and team organization.`,
    requirements: `Basic understanding of ESports and coaching is beneficial. Part-time seasonal position.`,
    skills: ['Coaching', 'Team Management', 'Strategy Development', 'ESports Knowledge'],
    postedDate: '2024-12-22',
    externalUrl: 'https://www.linkedin.com/jobs/view/assistant-esports-coach-at-carroll-county-schools-4345772917',
    source: 'linkedin',
    category: 'coaching',
  },
];

// Generate Google JobPosting schema for a job
export function generateJobPostingSchema(job: EsportsJob) {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id,
    },
    datePosted: job.postedDate,
    validThrough: job.validThrough || "2025-03-31",
    employmentType: job.type === "Full-time" ? "FULL_TIME" :
                    job.type === "Part-time" ? "PART_TIME" :
                    job.type === "Contract" ? "CONTRACTOR" : "INTERN",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.externalUrl,
      logo: job.companyLogo || undefined,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.split(",")[0],
        addressCountry: job.country,
      },
    },
    baseSalary: job.salary && job.salary !== "Competitive" ? {
      "@type": "MonetaryAmount",
      currency: job.country === "United States" ? "USD" :
                job.country === "United Kingdom" ? "GBP" : "USD",
      value: {
        "@type": "QuantitativeValue",
        value: job.salary,
        unitText: "YEAR",
      },
    } : undefined,
    skills: job.skills.join(", "),
    image: job.heroImage,
    industry: "Esports & Gaming",
    occupationalCategory: job.category,
    directApply: false,
    url: job.externalUrl,
  };
}

// Generate aggregate JobPosting schema for multiple jobs
export function generateJobListingSchema(jobs: EsportsJob[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: generateJobPostingSchema(job),
    })),
  };
}

// Helper functions
export function getJobsByCategory(category: EsportsJob['category']): EsportsJob[] {
  return esportsJobs.filter(job => job.category === category);
}

export function getJobsByCountry(country: string): EsportsJob[] {
  return esportsJobs.filter(job => job.country === country);
}

export function getJobsByType(type: EsportsJob['type']): EsportsJob[] {
  return esportsJobs.filter(job => job.type === type);
}

export function getJobById(id: string): EsportsJob | undefined {
  return esportsJobs.find(job => job.id === id);
}

export function getAllCategories(): EsportsJob['category'][] {
  return [...new Set(esportsJobs.map(job => job.category))];
}

export function getAllCountries(): string[] {
  return [...new Set(esportsJobs.map(job => job.country))];
}
