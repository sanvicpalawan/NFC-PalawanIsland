import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MerQato — Connected Business Experiences",
    template: "%s | MerQato",
  },
  description:
    "MerQato connects physical places, products, and equipment to useful digital experiences with QR, NFC, and connected business software.",
};

// Light is always the default. Only a visitor's explicit dark choice is restored.
// This runs in the head so the page does not flash light before hydration.
const themeScript = `try{document.documentElement.classList.toggle('dark',localStorage.getItem('merqato_theme')==='dark')}catch(e){document.documentElement.classList.remove('dark')}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
