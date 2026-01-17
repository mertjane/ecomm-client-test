'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/lib/hooks/useProducts';
import { getCollectionType } from '@/lib/utils/url-mapping';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedProduct } from '@/lib/redux/slices/selectedProductSlice';
import type { Product } from '@/types/product';

const CARD_WIDTH_MOBILE = 280;
const CARD_WIDTH_DESKTOP = 420;

interface MayAlsoLikeSectionProps {
    slug: string;
    product: Product;
}

const MayAlsoLikeSection = ({ slug, product }: MayAlsoLikeSectionProps) => {
    const dispatch = useAppDispatch();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const collectionType = getCollectionType(slug);

    const handleProductClick = (item: Product) => {
        dispatch(setSelectedProduct(item));
    };

    const { products, isLoading, error } = useProducts({
        slug: slug,
        type: collectionType,
        per_page: 10,
    });

    // Filter out the current product from the list
    const filteredProducts = products?.filter((p: Product) => p.id !== product?.id) || [];

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
            setTimeout(checkScrollButtons, 300);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            setTimeout(checkScrollButtons, 300);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full py-8 md:py-12 overflow-hidden px-4 md:px-14">
                <h2 className="text-2xl md:text-3xl font-light text-center mb-8">You May Also Like</h2>
                <div className="animate-pulse flex gap-4 md:gap-6 justify-start md:justify-center overflow-x-auto">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-56 md:w-64 h-80 md:h-96 bg-gray-200 rounded-xl flex-shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !filteredProducts?.length) {
        return null;
    }

    return (
        <div className="w-full min-h-[80vh] md:min-h-screen py-10 md:py-20 px-4 md:px-14 overflow-hidden flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-light text-center mb-2">You May Also Like</h2>
            <p className="text-center mb-6 max-w-2xl text-sm md:text-base text-muted-foreground px-4">
                Discover similar products from our collection.
            </p>

            <div className="flex justify-center gap-4 mb-6">
                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`p-2 md:p-3 rounded-full border border-emperador/30 transition-all duration-200 ${canScrollLeft
                            ? 'hover:bg-emperador hover:text-white cursor-pointer'
                            : 'opacity-40 cursor-not-allowed'
                        }`}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`p-2 md:p-3 rounded-full border border-emperador/30 transition-all duration-200 ${canScrollRight
                            ? 'hover:bg-emperador hover:text-white cursor-pointer'
                            : 'opacity-40 cursor-not-allowed'
                        }`}
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>

            <div className="relative w-full">
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollButtons}
                    className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {filteredProducts.map((item: Product) => (
                        <Link
                            href={`/product/${item.slug}`}
                            key={item.id}
                            onClick={() => handleProductClick(item)}
                            className="group flex-shrink-0"
                        >
                            <div
                                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                                style={{ width: `clamp(${CARD_WIDTH_MOBILE}px, 70vw, ${CARD_WIDTH_DESKTOP}px)` }}
                            >
                                <div className="relative h-auto bg-gray-50 overflow-hidden">
                                    {item.images?.[0]?.src ? (
                                        <Image
                                            src={item.images[0].src}
                                            alt={item.images[0].alt || item.name}
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            width={1000}
                                            height={1000}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            No image
                                        </div>
                                    )}
                                </div>

                                <div className="p-3 md:p-4 h-24 md:h-[120px]">
                                    <h3
                                        className="text-base md:text-lg font-medium text-granite group-hover:text-emperador transition-colors line-clamp-2 h-12 md:h-[60px]"
                                    >
                                        {item.name}
                                    </h3>
                                    {item.price_html && (
                                        <div className="flex items-baseline gap-1 text-sm md:text-base">
                                            <span>From</span>
                                            <p className="text-base md:text-lg font-semibold text-emperador">
                                                £{item.price_html}
                                            </p>
                                            <span>/M<sup>2</sup></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MayAlsoLikeSection;