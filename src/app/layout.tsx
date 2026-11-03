import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND_CONFIG } from "@/config/brand";

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} (${BRAND_CONFIG.koreanName}) - ${BRAND_CONFIG.sloganVi}`,
  description: BRAND_CONFIG.descriptionVi,
  manifest: "/manifest.json",
  keywords: [
    "tiếng hàn",
    "học tiếng hàn",
    "TOPIK",
    "tiếng hàn sơ cấp",
    "flashcard SRS",
    "học hangul",
    "tiếng hàn junghyeon",
    "정현 한국어",
  ],
  authors: [{ name: "JungHyeon Korean Education" }],
  openGraph: {
    title: `${BRAND_CONFIG.name} - ${BRAND_CONFIG.sloganVi}`,
    description: BRAND_CONFIG.descriptionVi,
    siteName: BRAND_CONFIG.name,
    locale: "vi_VN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0C1716" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Noto+Sans+KR:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
