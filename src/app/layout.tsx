import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CircleLayer - AI-Powered Onchain Identity & SocialFi",
  description: "Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on the fastest blockchain network.",
  keywords: ["blockchain", "AI", "NFT", "identity", "social", "reputation", "circles"],
  authors: [{ name: "CircleLayer Team" }],
  openGraph: {
    title: "CircleLayer - AI-Powered Onchain Identity & SocialFi",
    description: "Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on the fastest blockchain network.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CircleLayer - AI-Powered Onchain Identity & SocialFi",
    description: "Create your AI Twin NFT, build reputation through social interactions, and join exclusive circles on the fastest blockchain network.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
