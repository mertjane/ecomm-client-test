'use client';

import React from 'react'
import { cn } from '@/lib/utils';
import { ProductVariation } from '@/lib/api/variations';
import CustomCutTrigger from '@/app/components/layout/custom-cut-trigger/CustomCutTrigger';
import CustomCutModal from '@/app/components/modals/CustomCutModal';

interface SpVariationsProps {
    isTilingProduct?: boolean;
    variations: ProductVariation[];
    selectedVariation: ProductVariation | null;
    piecePriceMap: Record<string, number>;
    showSizeWarning: boolean;
    showCustomCutForm: boolean;
    setShowCustomCutForm: (value: boolean) => void;
    applyVat: (price: number) => number;
    handleSelectedVariation: (variation: ProductVariation) => void;
}

const SpVariations = ({
    isTilingProduct,
    variations,
    selectedVariation,
    piecePriceMap,
    showSizeWarning,
    showCustomCutForm,
    setShowCustomCutForm,
    applyVat,
    handleSelectedVariation,
}: SpVariationsProps) => {
    // Sort variations: regular tiles first, then Full Size Sample, then Free Sample last
    const sortedVariations = [...variations].sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aIsFreeSample = aName.includes('free sample');
        const bIsFreeSample = bName.includes('free sample');
        const aIsFullSizeSample = aName.includes('full size sample');
        const bIsFullSizeSample = bName.includes('full size sample');

        // Free Sample always last
        if (aIsFreeSample && !bIsFreeSample) return 1;
        if (!aIsFreeSample && bIsFreeSample) return -1;

        // Full Size Sample second to last
        if (aIsFullSizeSample && !bIsFullSizeSample) return 1;
        if (!aIsFullSizeSample && bIsFullSizeSample) return -1;

        // Keep original order for regular variations
        return 0;
    });

    return (
        <div className='flex flex-col mt-4 py-4'>
            <div className='flex items-center gap-3'>
                <strong className='text-2xl font-light'>Select Size</strong>
                {showSizeWarning && (
                    <span className="text-sm text-destructive animate-shake bg-clay text-white px-4 py-1 rounded-xl w-fit">
                        Size required
                    </span>
                )}
            </div>
            {/* variatons */}
            <div className=' w-full flex flex-col mt-4'>
                {/* headers */}
                <div className='flex px-4 pt-2'>
                    <small className='flex-4 text-clay'>Size</small>
                    {isTilingProduct && (
                        <small className='flex-1 text-clay text-end'>per tile</small>
                    )}
                    {isTilingProduct ? (
                        <small className='flex-1 text-clay text-end'>per m<sup>2</sup></small>
                    ) : (
                        <small className='flex-1 text-clay text-end '>per item</small>
                    )}

                </div>

                {/* Variation name eg 300x300x12             per tile price        per m2 price */}
                {sortedVariations.map((v) => {
                    const pricePerSqm = applyVat(parseFloat(v.price));
                    const piecePrice = applyVat(piecePriceMap[v.name] ?? 0);

                    const isSelected = selectedVariation?.id === v.id;

                    return (
                        <div onClick={() => handleSelectedVariation(v)} key={v.id}
                            className={cn(
                                // 1. Base Styles (Always applied)
                                'py-3 border w-full flex rounded-lg cursor-pointer items-center mt-2.5 border-dashed duration-150 transition-all',

                                // 2. Conditional Styles
                                isSelected
                                    ? 'border-emperador border-solid border bg-emperador/10' // Selected State: Bold border color and slightly darker bg
                                    : 'border-gray-200 bg-emperador/5 hover:border-emperador/50' // Unselected State: Subtle dashed border
                            )}
                        >

                            <span className='flex-4 text-granite pl-4'>{v.name}</span>
                            {isTilingProduct ? (
                                <span className='flex-1 text-granite text-end'>£{piecePrice.toFixed(2)}</span>
                            ) : (
                                <></>
                            )}
                            <span className='flex-1 text-granite text-end mr-4'>£{pricePerSqm.toFixed(2)}</span>
                        </div>
                    )

                })}

            </div>

            {/* CUSTOM CUT TRIGGER SECTION */}
            {isTilingProduct && (
                <>
                    <CustomCutTrigger setIsOpen={setShowCustomCutForm} />
                    <CustomCutModal isOpen={showCustomCutForm} setIsOpen={setShowCustomCutForm} />
                </>
            )}
        </div>
    )
}

export default SpVariations