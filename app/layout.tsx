import type { Metadata, Viewport } from "next";
import { Sen } from 'next/font/google';
import { Lora } from 'next/font/google';
import "./globals.css";
import { Header } from "./components/layout/header/Header";
import { Cart } from "./components/layout/cart/Cart";
import { Search } from "./components/layout/search/Search";
import { QuickViewSidebar } from "./components/layout/quick-view-sidebar";
import { FilterSidebar } from "./components/layout/filterSidebar";
//import { CartDevTools } from "./components/dev/CartDevTools";
import { Providers } from "./providers/Providers";
import Footer from "./components/layout/footer/Footer";
import CookieConsent from "./components/layout/ CookieConsent";

const sen = Sen({
  subsets: ['latin'],
  variable: '--font-sen',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  style: ['italic'],
  variable: '--font-lora',
  display: 'swap',
});

// Safari 15.3 requires explicit viewport settings to prevent rendering bugs
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allows accessibility zooming
  viewportFit: 'cover', // Fixes display around the "notch"
  themeColor: '#f2f2f2',
};



export const metadata: Metadata = {
  title: "Authentic Stone | Premium Stone Tiles & Custom Stone Projects",
  description: "Leading UK importer of natural stone tiles since 2007",
  appleWebApp: {
    capable: true,
    title: "Authentic Stone",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false, // Prevents Safari from auto-linking numbers if unwanted
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sen.variable} ${lora.variable} min-h-screen antialiased`}>

        <Providers>
          <Header />
          <Search />
          {children}
          <Cart />
          <QuickViewSidebar />
          <FilterSidebar />
          <Footer />
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
