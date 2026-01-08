// components/layout/header/Logo.tsx
import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link 
      href="/" 
      // We use scale-125 or scale-150 to make it bigger visually 
      // without affecting the header's height.
      className="block cursor-pointer"
      aria-label="Authentic Stone Home"
    >
      <Image
        src="/logos/Authentic-Stone_Long-Strapline-Logo_dark.png"
        alt="Authentic Stone"
        width={1000}
        height={200}
        priority
        // Increased width from 600px to 800px or similar
        style={{ width: '500px', height: 'auto', maxWidth: 'none' }}
      />
    </Link>
  );
}