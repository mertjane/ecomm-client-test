'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';

interface SpImageCarouselProps {
    images: ProductImage[];
    currentImageIndex: number;
    onImageSelect: (index: number) => void;
}

const SpImageCarousel = ({ images, currentImageIndex, onImageSelect }: SpImageCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const container = scrollContainerRef.current;
            if (container) {
                setIsOverflowing(container.scrollWidth > container.clientWidth);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [images]);

    if (!images || images.length <= 1) return null;

    return (
        <div className="relative mt-10 overflow-hidden">
            <div
                ref={scrollContainerRef}
                className={cn('flex gap-3 overflow-x-auto scrollbar-hide', isOverflowing && 'pr-12')}
            >
                {images.map((image, index) => (
                    <button
                        key={image.id || index}
                        onClick={() => onImageSelect(index)}
                        className={cn(
                            'relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200',
                            index === currentImageIndex
                                ? 'border-emperador ring-2 ring-emperador/30'
                                : 'border-transparent hover:border-emperador/50'
                        )}
                        style={{ width: '132px', height: '132px' }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt || `Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="112px"
                        />
                    </button>
                ))}
            </div>
            {/* Right side blur/fade effect - only shown when content overflows */}
            {isOverflowing && (
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            )}
        </div>
    );
};

export default SpImageCarousel;
