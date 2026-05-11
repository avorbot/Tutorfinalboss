import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyTutor — Expert Tutors for Every Level",
    template: "%s | MyTutor",
  },
  description:
    "Connect with verified tutors in Uganda and beyond. Mathematics, Science, English and more. All levels, all devices.",
  keywords: [
    "online tutor",
    "Uganda tutoring",
    "learn online",
    "mathematics tutor",
    "A-Level tutoring",
    "kids learning",
    "primary school tutor",
  ],
  openGraph: {
    title: "MyTutor — Expert Tutors for Every Level",
    description:
      "Connect with verified tutors. Mathematics, Science, English and more.",
    siteName: "MyTutor",
    locale: "en_UG",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
