"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSearch } from "@/lib/hooks/useSearch";

export function SearchBar() {
  const { openSearch } = useSearch();

  return (
    <div className="relative w-full max-w-md sm:px-2 lg:px-4">
      <div className="relative flex items-center transition-all duration-300">
        <Search
          className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none"
          strokeWidth={1.5}
        />
        <Input
          type="text"
          placeholder="Search for products..."
          readOnly
          onClick={openSearch}
          className={cn(
            "h-10 w-full pl-12 pr-12 border-0 bg-none shadow-none cursor-pointer",
            "text-base font-normal tracking-wide",
            "placeholder:text-muted-foreground/60",
            "hover:bg-muted/50 transition-all duration-300"
          )}
        />
      </div>
    </div>
  );
}