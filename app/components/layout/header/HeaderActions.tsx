"use client";

import { useState } from "react";
import { User, ShoppingCart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MobileNavigation } from "./MobileNavigation";

// Redux
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { openCart } from "@/lib/redux/slices/cartSlice";

export function HeaderActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { itemCount } = useAppSelector((state) => state.cart);
  const [open, setOpen] = useState(false);

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const handleAccountClick = () => {
    router.push('/my-account');
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Account Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAccountClick}
        className="h-10 w-10 rounded-full hover:bg-muted/80 transition-colors relative z-50"
        aria-label="Account"
      >
        <User className="h-6 w-6" strokeWidth={1.5} />
      </Button>

      {/* Cart Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full hover:bg-muted/80 transition-colors relative z-50"
        aria-label="Shopping cart"
        onClick={handleCartClick}
      >
        <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] z-50"
          >
            {itemCount}
          </Badge>
        )}
      </Button>

      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-muted/80 transition-colors lg:hidden relative z-50"
            aria-label="Menu"
          >
            <Menu className="h-7 w-7" strokeWidth={1.5} />
          </Button>
        </SheetTrigger>
        {/* Adjusted width and removed default padding for better control */}
        <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-left text-lg font-bold uppercase tracking-wider text-emperador">
              Menu
            </SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="flex-1 h-full">
            <div className="px-6 py-6 pb-20">
              <MobileNavigation onNavigate={() => setOpen(false)} />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}