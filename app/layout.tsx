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

  title: { default: "Crestlane Digital | Websites, Software & Automation", template: "%s | Crestlane Digital" },
  alternates: { canonical: "/" },
  description:
    "Crestlane Digital builds professional websites, custom applications, administrative systems, and business automation for growing businesses and sports organizations.",

  openGraph: {
    title: "Crestlane Digital | Websites, Software & Automation",
    description: "Websites. Software. Smarter operations.",
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
    title: "Crestlane Digital | Websites, Software & Automation",
    description: "Websites. Software. Smarter operations.",
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
      <body className="min-h-full flex flex-col">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Organization",
          name: "Crestlane Digital", url: "https://crestlanedigital.com",
          logo: "https://crestlanedigital.com/CrestLaneDigitalLogo.jpeg",
          email: "sales@crestlanedigital.com", telephone: "+1-703-431-4468",
          description: "Websites, custom applications, administrative systems, and business automation.",
        }).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
