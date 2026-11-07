import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Draft AI policy | Phil Araujo",
  description: "Your draft AI policy, written from your answers to the AI readiness check.",
  robots: { index: false, follow: false },
};

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
