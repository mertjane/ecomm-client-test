"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearch } from "@/lib/hooks/useSearch";

export function SearchBar() {
  const { openSearch } = useSearch();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('SearchBar clicked - opening search');
    openSearch();
  };

  return (
    <div className="relative w-full max-w-md">
      <div
        className="relative flex z-50 items-center transition-all duration-300 cursor-pointer"
onClick={handleClick}
      >
        <Search
          className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground pointer-events-none"
          strokeWidth={1.5}
        />
        <Input
          type="text"
          placeholder="Search for products..."
          readOnly
          className={cn(
            "h-10 w-full pl-10 sm:pl-12 pr-4 border-0 bg-none shadow-none cursor-pointer",
            "text-sm sm:text-base font-normal tracking-wide",
            "placeholder:text-muted-foreground/60",
            "hover:bg-muted/50 transition-all duration-300",
            "pointer-events-none"
          )}
        />
      </div>
    </div>
  );
}