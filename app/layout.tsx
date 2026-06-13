import type { Metadata } from "next";
import "./globals.css";
import { CloudSyncProvider } from "@/components/CloudSyncProvider";

export const metadata: Metadata = {
  title: "PedaStudio",
  description: "AI-powered lesson planning for municipal school teachers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-white">
        <div className="max-w-[480px] mx-auto min-h-screen">
          <CloudSyncProvider>{children}</CloudSyncProvider>
        </div>
      </body>
    </html>
  );
}
