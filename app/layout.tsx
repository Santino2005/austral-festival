import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { ScanLine, Ticket as TicketIcon } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sourceSans = localFont({
  src: "../public/fonts/source-sans-3.woff2",
  weight: "200 900",
  style: "normal",
  display: "swap",
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "Peña Folklórica · Universidad Austral",
  description:
    "Venta de entradas para la peña folklórica de la Universidad Austral, en el Campus Pilar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {

  return (
    <html
      lang="es"
      className={`${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-amber-200/70 selection:text-amber-950">
        <header className="site-header sticky top-0 z-40">
          <div className="site-header-inner">
            <Link
              href="/"
              className="site-brand transition-opacity hover:opacity-85"
            >
              <Image src="/brand/pena-austral-emblem.png" alt="" width={938} height={758} className="site-brand-logo" preload unoptimized />
              <span className="site-brand-name">
                Peña Austral
                <span className="site-brand-subtitle">Universidad Austral</span>
              </span>
            </Link>
            <nav className="site-nav">
              <Link href="/#entradas" className="site-nav-tickets">
                <TicketIcon aria-hidden className="site-nav-icon" strokeWidth={1.5} />
                Entradas
              </Link>
              <Link href="/validar" className="site-nav-validation">
                <ScanLine aria-hidden className="site-nav-icon" strokeWidth={1.5} />
                Validar
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="site-footer border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-6 text-center text-[11px] font-medium uppercase tracking-[0.1em] leading-relaxed text-muted-foreground">
            Peña Folklórica · Universidad Austral · Campus Pilar · 2026
          </div>
        </footer>
        <Toaster position="top-center" richColors theme="light" />
      </body>
    </html>
  );
}
