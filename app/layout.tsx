import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduFlow",
  description: "AI-powered English lesson planning for Grade 1 teachers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white">
        <div className="max-w-[480px] mx-auto min-h-screen">{children}</div>
      </body>
    </html>
  );
}
