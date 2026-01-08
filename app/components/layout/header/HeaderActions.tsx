"use client";

import { User, ShoppingCart, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { MobileNavigation } from "./MobileNavigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { openCart } from "@/lib/redux/slices/cartSlice";

export function HeaderActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { itemCount } = useAppSelector((state) => state.cart);

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const handleAccountClick = () => {
    router.push('/my-account');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Account Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAccountClick}
        className="h-10 w-10 rounded-full hover:bg-muted transition-colors"
        aria-label="Account"
      >
        <User className="h-5 w-5" strokeWidth={1.5} />
      </Button>

      {/* Cart Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full hover:bg-muted transition-colors"
        aria-label="Shopping cart"
        onClick={handleCartClick}
      >
        <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Button>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-muted transition-colors lg:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-left uppercase tracking-wider">
              Menu
            </SheetTitle>
          </SheetHeader>
          <MobileNavigation />
        </SheetContent>
      </Sheet>
    </div>
  );
}