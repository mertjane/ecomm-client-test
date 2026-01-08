import type { Metadata } from "next";
import { Sen } from 'next/font/google';
import { Lora } from 'next/font/google';
import "./globals.css";
import { Header } from "./components/layout/header/Header";
import { Cart } from "./components/layout/cart/Cart";

import { QuickViewSidebar } from "./components/layout/quick-view-sidebar";
//import { CartDevTools } from "./components/dev/CartDevTools";
import { Providers } from "./providers/Providers";
import Footer from "./components/layout/footer/Footer";

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



export const metadata: Metadata = {
  title: "Authentic Stone | Premium Stone Tiles & Custom Stone Projects",
  description: "Leading UK importer of natural stone tiles since 2007",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sen.variable} ${lora.variable}min-h-screen antialiased`}>

        <Providers>
          <Header />
          {children}
          <Cart />

          <QuickViewSidebar />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
