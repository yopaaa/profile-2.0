import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cursor from "./components/Cursor";
import portfolioData from "../data/data.json";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const { seo, personal } = portfolioData;

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.title,
    template: `%s | ${personal.name}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.author, url: seo.siteUrl }],
  creator: seo.author,
  publisher: seo.author,
  applicationName: `${personal.name} Portfolio`,
  generator: "Next.js",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: seo.siteUrl,
  },
  openGraph: {
    type: "profile",
    firstName: personal.shortName,
    lastName: "Pitra R.",
    username: "yopaaa",
    gender: "male",
    locale: "id_ID",
    url: seo.siteUrl,
    title: seo.title,
    description: seo.description,
    siteName: `${personal.name} — Portfolio`,
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${personal.name} — ${personal.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    creator: "@yopaaa_",
    images: [seo.ogImage],
  },
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
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="canonical" href={seo.siteUrl} />
      </head>
      <body className={inter.className}>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
