'use client';

import Image from 'next/image'
import { useState } from 'react'

import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import type { Product } from '@/types/product';
import SpImageCarousel from '@/app/components/layout/sp-image-carousel/SpImageCarousel';
import SpImageGallery from '@/app/components/layout/sp-image-gallery/SpImageGallery';

interface SpPhotoSectionProps {
    product: Product;
}

const SpPhotoSection = ({ product }: SpPhotoSectionProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
    const images = product.images || [];

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleImageSelect = (index: number) => {
        setCurrentImageIndex(index);
    };

    const openGallery = () => {
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    // Handle mobile click on image to open gallery
    const handleMobileImageClick = () => {
        // Only trigger on mobile (check for touch device or screen width)
        if (window.innerWidth < 1024) {
            openGallery();
        }
    };

    return (
        <>
            <div className="flex flex-col">
                {/* Main Image */} 
                <div className="relative aspect-square bg-muted group rounded-xl overflow-hidden">
                    {images.length > 0 ? (
                        <>
                            <div
                                onClick={handleMobileImageClick}
                                className="w-full h-full cursor-pointer lg:cursor-default"
                            >
                                <Image
                                    src={images[currentImageIndex].src}
                                    alt={images[currentImageIndex].alt || product.name}
                                    fill
                                    className="object-cover shadow-xl"
                                    sizes="(max-width: 768px) 100vw, 600px"
                                />
                            </div>

                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <>
                                    {/* Expand button - desktop only, triggers gallery */}
                                    <button
                                        onClick={openGallery}
                                        className='absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 right-4 top-4 h-8 p-2 w-8 bg-white/90 hover:bg-white text-emperador rounded-full shadow-lg cursor-pointer'
                                        aria-label='Expand gallery'
                                    >
                                        <Expand className='w-full h-full' />
                                    </button>
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-emperador" />
                                    </button>
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5 text-emperador" />
                                    </button>

                                    {/* Image Indicators */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_: any, index: any) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                    ? 'bg-emperador w-6'
                                                    : 'bg-white/60 hover:bg-white/80'
                                                    }`}
                                                aria-label={`Go to image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No image available
                        </div>
                    )}
                </div>

                {/* Image Carousel - below main image */}
                <SpImageCarousel
                    images={images}
                    currentImageIndex={currentImageIndex}
                    onImageSelect={handleImageSelect}
                />
            </div>

            {/* Image Gallery - fullscreen overlay */}
            <SpImageGallery
                images={images}
                currentImageIndex={currentImageIndex}
                isOpen={isGalleryOpen}
                onClose={closeGallery}
                onImageSelect={handleImageSelect}
            />
        </>
    )
}

export default SpPhotoSection
