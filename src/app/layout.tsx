import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rui Figueira & Roque Lda",
    default: "Rui Figueira & Roque Lda - Mediação Imobiliária e Seguros",
  },
  description: "O seu parceiro de confiança para encontrar o imóvel ideal e o seguro mais adequado às suas necessidades.",
  keywords: ["imobiliária", "seguros", "comprar casa", "arrendar", "seguro automóvel", "seguro de vida", "confiança"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
