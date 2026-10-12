import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ui/Toast";

const fraunces = localFont({
  src: [
    {
      path: "./fonts/Fraunces-Variable.ttf",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "./fonts/Fraunces-Italic-Variable.ttf",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const instrument = localFont({
  src: "./fonts/InstrumentSans-Variable.ttf",
  variable: "--font-instrument",
  weight: "400 600",
  display: "swap",
});

const caveat = localFont({
  src: "./fonts/Caveat-Variable.woff2",
  variable: "--font-caveat",
  weight: "400 600",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://swd-24-kano-poly-jzgjfebzd-abbalolos-projects.vercel.app";

const SCHOOL_NAME = "Kano Polytechnic School of Technology";
const SITE_NAME = "Class Memories";
const DESCRIPTION =
  "A place for Kano Polytechnic School of Technology classmates to remember each other. Photos, contact info, and the small things.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} — ${SCHOOL_NAME}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,

  applicationName: SITE_NAME,
  authors: [{ name: SCHOOL_NAME }],
  creator: SCHOOL_NAME,
  publisher: SCHOOL_NAME,

  keywords: [
    "Kano Polytechnic",
    "Kano Polytechnic School of Technology",
    "class memories",
    "classmates",
    "yearbook",
    "alumni",
    "Kano",
    "Nigeria",
    "HND",
    "ND",
    "SWD",
  ],

  icons: {
    icon: [
      {
        url: "https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png",
        type: "image/png",
      },
    ],
    shortcut:
      "https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png",
    apple:
      "https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png",
    },
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SCHOOL_NAME}`,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_NG",
    images: [
      {
        url: "https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png",
        width: 1200,
        height: 1200,
        alt: `${SCHOOL_NAME} logo`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SCHOOL_NAME}`,
    description: DESCRIPTION,
    images: [
      "https://kanopoly.edu.ng/wp-content/uploads/2024/09/Kano-State-Polytechnic-logo.png",
    ],
  },

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F1" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${caveat.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}