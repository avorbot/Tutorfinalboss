import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MyTutor Kids — Learn, Play & Grow!",
    template: "%s | MyTutor Kids",
  },
  description: "Fun and safe learning for children under 9. Gamified subjects, points, badges, and 3D adventures!",
};

export default function KidsRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
