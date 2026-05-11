import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyTutor — Find Expert Tutors Near You",
  description: "Connect with qualified tutors for personalized learning. All levels, all subjects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-gray-50">{children}</body>
    </html>
  );
}
