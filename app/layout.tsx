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
      "@id": "https://mvp.actor/#website",
      name: "MVP",
      alternateName: ["MVP Esports", "MVP Recruitment"],
      url: "https://mvp.actor",
      description: "The leading esports recruitment agency connecting top talent with gaming industry opportunities worldwide.",
      publisher: {
        "@id": "https://mvp.actor/#organization"
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://mvp.actor/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "EmploymentAgency",
      "@id": "https://mvp.actor/#organization",
      name: "MVP",
      alternateName: ["MVP Esports", "MVP Recruitment", "MVP Esports Recruitment Agency"],
      url: "https://mvp.actor",
      logo: {
        "@type": "ImageObject",
        "@id": "https://mvp.actor/#logo",
        url: "https://mvp.actor/web-app-manifest-512x512.png",
        contentUrl: "https://mvp.actor/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        caption: "MVP - Esports Recruitment Agency"
      },
      image: {
        "@id": "https://mvp.actor/#logo"
      },
      description: "The leading esports recruitment agency specializing in placing top talent across gaming, esports, and interactive entertainment. Expert recruiters with 20+ years of industry experience.",
      slogan: "Your MVP in Esports Recruitment",
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "Germany" }
      ],
      knowsAbout: [
        "Esports Recruitment",
        "Gaming Industry Staffing",
        "Esports Talent Acquisition",
        "Gaming Executive Search",
        "Esports Headhunting",
        "Video Game Industry Jobs",
        "Interactive Entertainment Careers"
      ],
      founder: {
        "@id": "https://mvp.actor/#dankeegan"
      },
      employee: {
        "@id": "https://mvp.actor/#dankeegan"
      },
    },
    {
      "@type": "Person",
      "@id": "https://mvp.actor/#dankeegan",
      name: "Dan Keegan",
      jobTitle: "Founder & Lead Recruiter",
      description: "Esports recruitment specialist with over 20 years of experience in competitive gaming, esports operations, and talent acquisition across the gaming industry.",
      image: {
        "@type": "ImageObject",
        url: "https://mvp.actor/dan-keegan.webp",
        width: 400,
        height: 400
      },
      worksFor: {
        "@id": "https://mvp.actor/#organization"
      },
      knowsAbout: [
        "Esports Recruitment",
        "Gaming Industry",
        "Talent Acquisition",
        "Executive Search",
        "Competitive Gaming",
        "Esports Operations"
      ],
      expertise: "20+ years in esports and gaming recruitment"
    },
  ],
};

export const metadata: Metadata = {
  title: "MVP 🎮 | Esports Recruitment Agency",
  description:
    "The leading esports recruitment agency connecting top talent with gaming industry opportunities. Expert recruiters placing professionals in esports, gaming, and interactive entertainment roles worldwide.",
  authors: [{ name: "Dan Keegan", url: "https://mvp.actor" }],
  keywords: [
    "esports recruitment agency",
    "gaming recruitment",
    "esports jobs",
    "gaming industry jobs",
    "esports recruiters",
    "gaming headhunters",
    "esports careers",
    "gaming talent agency",
    "esports staffing",
    "video game jobs",
    "esports hiring",
    "gaming employment",
  ],
  robots: "index, follow",
  openGraph: {
    title: "MVP 🎮 | Esports Recruitment Agency",
    description:
      "The leading esports recruitment agency connecting top talent with gaming industry opportunities worldwide.",
    siteName: "MVP",
    locale: "en",
    images: [
      {
        url: "https://mvp.actor/og-image.png",
        width: 1200,
        height: 630,
        alt: "MVP - Esports Recruitment Agency",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MVP 🎮 | Esports Recruitment Agency",
    description:
      "The leading esports recruitment agency connecting top talent with gaming industry opportunities.",
    images: ["https://mvp.actor/og-image.png"],
  },
  appleWebApp: {
    title: "MVP",
  },
  alternates: {
    canonical: "https://mvp.actor",
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

        {/* Favicon - generated by RealFaviconGenerator */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="MVP" />
        <link rel="manifest" href="/site.webmanifest" />

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
