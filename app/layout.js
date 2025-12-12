// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Heathrow Parking Under £30 | 70% Off | SimpleParking UK",
  description:
    "Affordable Heathrow meet & greet parking from just £30! Save 70% on official airport parking. Book online for the best rates.",
  icons: {
    icon: "favicon.ico",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  keywords: [
    "heathrow airport parking",
    "london airport parking",
    "affordable heathrow parking",
    "meet and greet parking",
    "parking under £30",
    "heathrow parking deals",
    "valet parking heathrow",
  ],
  verification: {
    google: "seozSF04L1eyNoQHrtx8OtH8Sou9mguXMGw3bL9BSeQ",
  },
  openGraph: {
    title: "Heathrow Parking Under £30 | 70% Off | SimpleParking UK",
    description:
      "Affordable Heathrow meet & greet parking from just £30! Save 70% on official airport parking. Book online for the best rates.",
    url: "https://simpleparking.uk",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "SimpleParking Heathrow Parking Deal",
      },
    ],
    siteName: "SimpleParking",
    locale: "en_GB",
  },
  alternates: {
    canonical: "https://simpleparking.uk",
    languages: {
      "en-GB": "https://simpleparking.uk",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Heathrow Parking Under £30 | 70% Off | SimpleParking UK",
    description: "Affordable Heathrow meet & greet parking from just £30! Save 70% on official airport parking.",
    images: ["/favicon.ico"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=63072000; includeSubDomains; preload" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GoogleAnalytics />
        {children}

        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Heathrow Airport Parking",
            description: "Affordable meet & greet parking service at Heathrow Airport",
            url: "https://simpleparking.uk",
            offers: {
              "@type": "Offer",
              price: "30",
              priceCurrency: "GBP",
              priceValidUntil: "2025-12-31",
              description: "Parking for under £30",
            },
            areaServed: {
              "@type": "GeoCircle",
              geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 51.47,
                longitude: -0.4543,
              },
              geoRadius: 50000,
            },
            serviceType: "Valet parking",
            provider: {
              "@type": "Organization",
              name: "SimpleParking UK",
            },
          })}
        </script>
        {/* Google Tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17474395596" />
        <script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17474395596');
          `}
        </script>
      </body>
    </html>
  );
}
