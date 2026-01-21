// components/layout/header/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "./SearchBar";
import { Navigation } from "./Navigation";
import { Logo } from "./Logo";
import { HeaderActions } from "./HeaderActions";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        "border-b border-border/40 backdrop-blur-lg",
        isScrolled ? "bg-background/95 shadow-sm" : "bg-background/80"
      )}
    >
      {/* Top Bar - Search and Actions */}
      <div className="border-b border-border/40">
        {/* Changed px-4 sm:px-6 to px-2 sm:px-4 */}
        <div className="mx-auto px-2 sm:px-4 lg:px-20 2xl:px-28">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <SearchBar />
            </div>
            <HeaderActions />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      {/* Changed px-4 sm:px-6 to px-2 sm:px-4 */}
      <div className=" mx-auto px-2 sm:px-4 lg:px-20">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 py-5 lg:gap-12 xl:gap-16">
          {/* Left Navigation */}
          <div className="hidden lg:flex lg:justify-start">
            <Navigation position="left" />
          </div>

          {/* Center Logo */}
          <div className="col-start-2 flex justify-center items-center relative h-10 lg:col-start-auto">
            <div className="absolute inset-0 flex items-center justify-center">
               <Logo />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="hidden lg:flex lg:justify-end">
            <Navigation position="right" />
          </div>
        </div>
      </div>
    </header>
  );
}