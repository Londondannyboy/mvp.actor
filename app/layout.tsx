import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CopilotProvider } from "./providers/CopilotProvider";
import { GlobalCopilotUI } from "./components/GlobalCopilotUI";
import { HlsVideoInit } from "./components/HlsVideoInit";
import "@copilotkit/react-ui/styles.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Site-wide schema - page-specific schemas (FAQPage, BreadcrumbList) are in individual pages
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://esportsjobs.quest/#website",
      name: "Esports Recruitment Agency Quest",
      alternateName: ["Esports Jobs Quest", "Esports Recruitment Agency"],
      url: "https://esportsjobs.quest",
      description: "Esports recruitment agency aggregating real esports jobs from across the gaming industry. Find job listings for pro players, coaches, content creators, and gaming professionals.",
      publisher: {
        "@id": "https://esportsjobs.quest/#organization"
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://esportsjobs.quest/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://esportsjobs.quest/#organization",
      name: "Esports Recruitment Agency Quest",
      alternateName: ["Esports Jobs Quest", "Esports Recruitment Agency"],
      url: "https://esportsjobs.quest",
      logo: {
        "@type": "ImageObject",
        "@id": "https://esportsjobs.quest/#logo",
        url: "https://esportsjobs.quest/web-app-manifest-512x512.png",
        contentUrl: "https://esportsjobs.quest/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        caption: "Esports Recruitment Agency Quest"
      },
      image: {
        "@id": "https://esportsjobs.quest/#logo"
      },
      description: "Global esports recruitment agency aggregating real esports jobs from across the gaming industry in competitive gaming, streaming, content creation, and esports organisations.",
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "Germany" }
      ],
      knowsAbout: [
        "Esports Recruitment Agency",
        "Esports Jobs",
        "Gaming Careers",
        "Esports Recruitment",
        "Gaming Industry Jobs",
        "Pro Player Opportunities",
        "Esports Coach Jobs",
        "Content Creator Jobs",
        "Tournament Organiser Jobs"
      ],
      founder: {
        "@id": "https://esportsjobs.quest/#dankeegan"
      },
      employee: {
        "@id": "https://esportsjobs.quest/#dankeegan"
      },
    },
    {
      "@type": "Person",
      "@id": "https://esportsjobs.quest/#dankeegan",
      name: "Dan Keegan",
      jobTitle: "Founder & Esports Industry Expert",
      description: "Esports and video games industry professional with over 20 years of experience in competitive gaming, esports operations, and talent acquisition.",
      image: {
        "@type": "ImageObject",
        url: "https://esportsjobs.quest/dan-keegan.webp",
        width: 400,
        height: 400
      },
      worksFor: {
        "@id": "https://esportsjobs.quest/#organization"
      },
      knowsAbout: [
        "Esports",
        "Video Games Industry",
        "Esports Recruitment",
        "Gaming Careers",
        "Competitive Gaming",
        "Esports Operations",
        "Talent Acquisition"
      ],
      expertise: "20+ years in video games and esports industry"
    },
  ],
};

export const metadata: Metadata = {
  title: "Esports Recruitment Agency 🎮 Gaming Talent Experts",
  description:
    "🎮 Esports recruitment agency connecting gaming talent with top organisations. Leading esports recruiters for coaching, marketing & management roles. Browse jobs and apply direct to employers. Your trusted esports recruiter.",
  authors: [{ name: "Dan Keegan", url: "https://esportsjobs.quest" }],
  keywords: [
    "esports recruitment agency",
    "esports recruiter",
    "esports recruiters",
    "esports jobs",
    "esports recruitment",
    "esports careers",
    "gaming jobs",
    "esports job board",
    "pro gaming jobs",
    "esports coach jobs",
    "content creator jobs",
    "streamer jobs",
    "tournament organiser jobs",
    "esports management jobs",
    "gaming industry careers",
    "esports analyst jobs",
    "shoutcaster jobs",
    "esports marketing jobs",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Esports Recruitment Agency 🎮 Gaming Talent Experts",
    description:
      "🎮 Esports recruitment agency connecting gaming talent with top organisations. Leading esports recruiters for coaching, marketing & management. Apply direct to employers.",
    siteName: "Esports Recruitment Agency Quest",
    locale: "en",
    images: [
      {
        url: "https://esportsjobs.quest/og-image.png",
        width: 1200,
        height: 630,
        alt: "Esports Recruitment Agency - Esports Jobs and Gaming Careers",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Esports Recruitment Agency 🎮 Gaming Talent Experts",
    description:
      "🎮 Esports recruitment agency connecting gaming talent with top organisations. Leading esports recruiters. Apply direct to employers.",
    images: ["https://esportsjobs.quest/og-image.png"],
  },
  appleWebApp: {
    title: "Esports Recruitment Agency Quest",
  },
  alternates: {
    canonical: "https://esportsjobs.quest",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical preconnects - establish early connections */}
        <link rel="preconnect" href="https://image.mux.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://stream.mux.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.mux.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Analytics - deferred to reduce TBT */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YZQVYF6Q3C"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YZQVYF6Q3C');
          `}
        </Script>
        <CopilotProvider>
          {children}
          <GlobalCopilotUI />
        </CopilotProvider>
        {/* Initialize HLS.js for Mux video streaming */}
        <HlsVideoInit />
      </body>
    </html>
  );
}
