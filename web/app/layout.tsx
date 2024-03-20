import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import EmojiContextProvider from "@/components/emoji-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Live Reactions",
  description: "Using Next.js and WebSocket to enable live reactions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <EmojiContextProvider>
        <body className={inter.className}>{children}</body>
      </EmojiContextProvider>
    </html>
  );
}
