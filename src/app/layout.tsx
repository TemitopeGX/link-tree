import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TemitopeGX | Digital Space",
    template: "%s | TemitopeGX",
  },
  description:
    "Welcome to TemitopeGX's digital space - A collection of insights, projects, and resources in software development and technology.",
  keywords: [
    "TemitopeGX",
    "software development",
    "technology",
    "blog",
    "portfolio",
    "digital space",
  ],
  authors: [{ name: "TemitopeGX" }],
  creator: "TemitopeGX",
  publisher: "TemitopeGX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://temitopegx.vercel.app",
    title: "TemitopeGX | Digital Space",
    description:
      "Welcome to TemitopeGX's digital space - A collection of insights, projects, and resources in software development and technology.",
    siteName: "TemitopeGX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TemitopeGX Digital Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TemitopeGX | Digital Space",
    description:
      "Welcome to TemitopeGX's digital space - A collection of insights, projects, and resources in software development and technology.",
    creator: "@TemitopeGX",
    images: ["/twitter-image.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-site-verification-code", // Add this when you have it
  },
  alternates: {
    canonical: "https://temitopegx.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-black via-gray-900 to-purple-900 min-h-screen`}
      >
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
