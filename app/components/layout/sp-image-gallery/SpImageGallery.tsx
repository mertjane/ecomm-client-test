'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';

interface SpImageGalleryProps {
    images: ProductImage[];
    currentImageIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onImageSelect: (index: number) => void;
}

const SpImageGallery = ({
    images,
    currentImageIndex,
    isOpen,
    onClose,
    onImageSelect,
}: SpImageGalleryProps) => {
    const [isLoading, setIsLoading] = useState(true);

    // Show loader for 2 seconds when gallery opens
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1500); // 1.5 seconds
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white">
            {isLoading ? (
                // Loading state with spinner
                <div className="flex items-center justify-center w-full h-full">
                    <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-emperador animate-spin" />
                </div>
            ) : (
                // Gallery content
                <div className="flex flex-col w-full h-full relative">
                    {/* Close button - positioned at top right */}
                    <button
                        onClick={onClose}
                        className="absolute flex items-center gap-1 md:gap-2 top-3 right-3 md:top-6 md:right-6 p-2 z-50 rounded-full border border-border bg-gray-100 hover:bg-emperador/10 cursor-pointer transition-colors"
                        aria-label="Close gallery"
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6 text-emperador" />
                        <span className='text-sm md:text-lg uppercase hidden sm:inline'>Close gallery</span>
                    </button>

                    {/* Main image display */}
                    <div className="flex-1 flex items-center justify-center p-4 pt-14 md:p-8 md:pl-40">
                        <div className="relative w-full h-full max-w-4xl">
                            <Image
                                src={images[currentImageIndex].src}
                                alt={images[currentImageIndex].alt || 'Product image'}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                priority
                            />
                        </div>
                    </div>

                    {/* Thumbnail strip - horizontal on mobile (bottom), vertical on desktop (left side) */}
                    <div className="
                        w-full h-[88px] px-4 py-3
                        md:w-[120px] md:h-auto md:absolute md:left-8 md:top-8 md:bottom-8 md:px-4 md:py-4
                        border-t md:border md:rounded-xl shadow-lg md:shadow-2xl border-emperador/10
                        overflow-x-auto md:overflow-y-auto md:overflow-x-hidden
                        flex flex-row md:flex-col items-center gap-2 md:gap-3
                        bg-white
                    ">
                        {images.map((image, index) => (
                            <button
                                key={image.id || index}
                                onClick={() => onImageSelect(index)}
                                className={cn(
                                    'flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200',
                                    index === currentImageIndex
                                        ? 'border-emperador ring-2 ring-emperador/30'
                                        : 'border-transparent hover:border-emperador/50'
                                )}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt || `Thumbnail ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 md:w-20 md:h-20 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpImageGallery;
