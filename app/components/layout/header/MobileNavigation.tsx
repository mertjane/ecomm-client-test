"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/types/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mt-8">
      <Accordion type="single" collapsible className="w-full">
        {navigationItems.map((item, index) => (
          <AccordionItem key={item.href} value={`item-${index}`} className="border-b-muted">
            {item.submenu ? (
              <>
                <AccordionTrigger className="text-base uppercase tracking-wide hover:no-underline py-4">
                  {item.label}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pl-4">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 py-2 px-3 rounded-md",
                          "text-sm uppercase tracking-wide",
                          "transition-colors hover:bg-muted",
                          pathname === subItem.href && "bg-muted text-primary"
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between py-4",
                  "text-base uppercase tracking-wide",
                  "transition-colors hover:text-primary",
                  pathname === item.href && "text-primary font-medium"
                )}
              >
                {item.label}
              </Link>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  );
}