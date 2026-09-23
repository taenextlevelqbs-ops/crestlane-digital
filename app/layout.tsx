import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crestlanedigital.com"),

  title: "Crestlane Digital",
  description:
    "Web design, development, digital systems, security, monitoring and ongoing support.",

  openGraph: {
    title: "Crestlane Digital",
    description: "Digital experiences for what's next.",
    url: "https://crestlanedigital.com",
    siteName: "Crestlane Digital",
    images: [
      {
        url: "/CrestLaneDigitalLogo.jpeg",
        alt: "Crestlane Digital",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Crestlane Digital",
    description: "Digital experiences for what's next.",
    images: ["/CrestLaneDigitalLogo.jpeg"],
  },

  icons: {
    icon: "/CrestLaneDigitalLogo.jpeg",
    apple: "/CrestLaneDigitalLogo.jpeg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
