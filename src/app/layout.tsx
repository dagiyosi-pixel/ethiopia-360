import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { getSessionUser } from "@/lib/auth";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Discover Ethiopia`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Ethiopia",
    "Ethiopian places",
    "Ethiopian history",
    "Ethiopian culture",
    "Addis Ababa",
    "Lalibela",
    "Gondar",
    "Harar",
    "Ethiopian photography",
    "ኢትዮጵያ",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — One country. Thousands of stories.`,
    description: SITE.description,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — One country. Thousands of stories.`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <head>
        {/* Fonts are loaded by link rather than next/font so a network failure
            degrades to the system stack instead of breaking the build. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Noto+Sans+Ethiopic:wght@400;500;600&display=swap"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
        >
          Skip to content
        </a>

        <ToastProvider>
          <Navbar
            user={
              user
                ? {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl,
                    demo: user.demo,
                  }
                : null
            }
          />

          <main id="main" className="flex-1 pb-20 lg:pb-0">
            {children}
          </main>

          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
