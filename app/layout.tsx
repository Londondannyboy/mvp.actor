import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CopilotProvider } from "./providers/CopilotProvider";
import { GlobalCopilotUI } from "./components/GlobalCopilotUI";
import "@copilotkit/react-ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EsportsJobs.quest - Find Your Career in Gaming",
  description: "AI-powered esports job search platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <CopilotProvider>
          {children}
          <GlobalCopilotUI />
        </CopilotProvider>
      </body>
    </html>
  );
}
