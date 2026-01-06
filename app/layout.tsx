import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CopilotProvider } from "./providers/CopilotProvider";
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
    <html lang="en">
      <body className={inter.className}>
        <CopilotProvider>{children}</CopilotProvider>
      </body>
    </html>
  );
}
