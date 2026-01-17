'use client';

import { Product } from '@/types/product';

interface SpProductDetailsProps {
    product: Product;
    isTilingProduct: boolean;
}

const SpProductDetails = ({product, isTilingProduct}: SpProductDetailsProps) => {
    return (
        <div className='py-2 flex flex-col gap-2'>
            {/* product slug eg. marble tiles, limestone tiles */}
            <p className='font-serif text-emperador italic'>{product.categories[0]?.name || "Marble"}</p>
            {/* Product title */}
            <h2>{product?.name.split(" ").slice(0, 2).join(" ")}</h2>
            {/* Product price */}
            {!isTilingProduct ? (
                <p className='text-emperador'>from £{product?.price_html} / <span>M<sup>2</sup></span></p>
            ) : (
                <p className='text-emperador'>from £{product?.price_html} </p>
            )}
            
        </div>
    )
}

export default SpProductDetails