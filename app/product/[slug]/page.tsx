'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Calculator as CalculatorIcon, CircleQuestionMark } from 'lucide-react';
import Calculator from '@/app/components/calculator/Calculator';
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedProduct } from '@/lib/redux/slices/selectedProductSlice';
import { getProductBySlug } from '@/lib/api/products';
import { fetchProductVariations, ProductVariation } from '@/lib/api/variations';
import { quantityToSqm, sqmToQuantity, getMinSqmIncrement, isMosaicVariation, extractMosaicDimensions } from '@/lib/utils/calculation';
import SpPhotoSection from '@/app/components/layout/sp-photo-section/SpPhotoSection';
import SpVariations from '@/app/components/layout/sp-variations/SpVariations';
import SpProductDetails from '@/app/components/layout/sp-product-details/SpProductDetails';
import SpExpandablePanels from '@/app/components/layout/sp-expandable-panels/SpExpandablePanels';
import SpTotalSection from '@/app/components/layout/sp-total-section/SpTotalSection';
import TilingProducts from '@/app/components/layout/tiling-products/TilingProducts';
import { AnimatePresence, motion } from 'motion/react';
import MayAlsoLikeSection from '@/app/components/layout/may-also-like/MayAlsoLikeSection';
import { NewsletterSection } from '@/app/components/layout/newsletter';


const SingleProductPage = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const product = useAppSelector((state) => state.selectedProduct.product);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [hoverPopup, setHoverPopup] = useState<boolean>(false);
    const [toggleVat, setToggleVat] = useState<boolean>(true);
    const [variations, setVariations] = useState<ProductVariation[]>([]);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);

    // UI and interaction states
    const [openTileCalculator, setOpenTileCalculator] = useState<boolean>(false);
    const [showCustomCutForm, setShowCustomCutForm] = useState<boolean>(false);
    const [showDeliveryEstimate, setShowDeliveryEstimate] = useState<boolean>(false);

    // Quantity and SQM state
    const [quantity, setQuantity] = useState<number>(0);
    const [sqm, setSqm] = useState<number>(0);
    const [addWastage, setAddWastage] = useState<boolean>(false);
    const [areaWidth, setAreaWidth] = useState<number>(0);
    const [areaLength, setAreaLength] = useState<number>(0);


    // Warning states
    const [showSizeWarning, setShowSizeWarning] = useState<boolean>(false);
    const [showQuantityWarning, setShowQuantityWarning] = useState<boolean>(false);
    const [showTileCalcWarning, setShowTileCalcWarning] = useState<boolean>(false);
    const [hasChangedQuantity, setHasChangedQuantity] = useState<boolean>(false);


    // Fetch product by slug if not in Redux (handles hard reload)
    useEffect(() => {
        const slug = params?.slug as string;
        if (!slug) return;

        // If product already exists in Redux and matches the slug, skip fetch
        if (product && product.slug === slug) {
            setIsLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const fetchedProduct = await getProductBySlug(slug);
                dispatch(setSelectedProduct(fetchedProduct));
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [params?.slug, product, dispatch]);

    // fetch variations data from API if product exists
    useEffect(() => {
        if (!product) return; // exit if no product

        const fetchData = async () => {
            try {
                const varsData = await fetchProductVariations(product.id);
                setVariations(varsData);
            } catch (error) {
                console.error("Failed to fetch variations:", error);
            }
        };

        fetchData();
    }, [product?.id]);

    console.log("Fetched variations data:", variations);

    // Handle tile calculator - calculates area and updates sqm/quantity
    const handleCalculateArea = () => {
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        // Convert cm² to m²
        const calculatedSqm = (areaWidth * areaLength) / 10000;

        if (calculatedSqm > 0) {
            setSqm(parseFloat(calculatedSqm.toFixed(2)));
            setHasChangedQuantity(true);
            setShowQuantityWarning(false);

            // Update quantity based on sqm
            const calculatedQuantity = sqmToQuantity(calculatedSqm, selectedVariation.name);
            setQuantity(calculatedQuantity);
        }
    }

    // Helper Function to extract width and length from a variation name
    // For mosaic tiles like "49x49x10 (305x305x10)", uses parentheses dimensions
    const extractDimensions = (name: string): [number, number] | null => {
        if (!name) return null;

        // Check if it's a mosaic tile (has dimensions in parentheses)
        if (isMosaicVariation(name)) {
            return extractMosaicDimensions(name);
        }

        // Standard format: match the first two numbers separated by 'x' (ignore thickness)
        const match = name.match(/(\d+)\s*x\s*(\d+)/i);
        if (!match) return null;

        const width = parseInt(match[1], 10);
        const length = parseInt(match[2], 10);

        return [width, length];
    };

    // Calculate tiles per square meter
    const calculateTilesPerSqm = (width: number, length: number) => {
        if (!width || !length) return 0;
        return Math.ceil(1_000_000 / (width * length));
    };

    // Map piece price dynamically from variations
    const piecePriceMap = useMemo(() => {
        if (!variations?.length) return {};

        return variations.reduce<Record<string, number>>((acc, variation) => {
            const price = parseFloat(variation.price);
            if (!price || price === 0) return acc; // skip free samples

            const dims = extractDimensions(variation.name);
            if (!dims) return acc;

            const [width, length] = dims;
            const tilesPerSqm = calculateTilesPerSqm(width, length);
            if (!tilesPerSqm) return acc;

            acc[variation.name] = parseFloat((price / tilesPerSqm).toFixed(2));
            return acc;
        }, {});
    }, [variations]);



    const applyVat = (price: number) => {
        return !toggleVat ? price / 1.2 : price;
    };


    const handleToggleVat = (checked: boolean) => {
        setToggleVat(checked);
    };



    const handleSelectedVariation = (variation: ProductVariation) => {
        setSelectedVariation(variation);
        setShowSizeWarning(false);

        // Check if the selected variation is a free sample
        const isFreeSample = variation.name.toLowerCase().includes('free sample');

        if (isFreeSample) {
            // Reset quantity and sqm for free samples
            setQuantity(0);
            setSqm(0);
            setHasChangedQuantity(false);
        } else {
            // Recalculate sqm when variation changes
            const calculatedSqm = quantityToSqm(quantity, variation.name);
            setSqm(calculatedSqm);
        }
    }

    // Check if selected variation is a sample
    const isSampleVariation = selectedVariation &&
        (selectedVariation.name.toLowerCase().includes('sample') ||
            selectedVariation.name.toLowerCase().includes('full size sample') ||
            selectedVariation.name.toLowerCase().includes('free sample'));
    // Check if product is tiling product
    const isTilingProduct = Array.isArray(product?.categories) &&
        product.categories.some((cat: any) =>
            cat.slug === 'tiles' ||
            cat.slug === 'tiling' ||
            cat.slug === 'tiling-products'
        );

    // Get selected variation price
    const selectedVariationPrice = selectedVariation
        ? applyVat(parseFloat(selectedVariation.price))
        : 0;

    // Calculate total price (wastage is already included in sqm/quantity values)
    const calculateTotal = () => {
        if (!selectedVariation) return 0;

        // For tiling products or samples: price is per piece/quantity
        // For tiles (non-tiling products): price is per sqm
        if (isTilingProduct || isSampleVariation) {
            return quantity * selectedVariationPrice;
        }
        return sqm * selectedVariationPrice;
    };

    const totalPrice = calculateTotal();

    // Show size warning with shake animation
    const triggerSizeWarning = () => {
        setShowSizeWarning(true);
        setTimeout(() => setShowSizeWarning(false), 3000);
    };

    // Show quantity warning
    const triggerQuantityWarning = () => {
        setShowQuantityWarning(true);
        setTimeout(() => setShowQuantityWarning(false), 3000);
    };

    // Handle quantity change
    const handleQuantityChange = (value: string) => {
        if (!selectedVariation && !isSampleVariation) {
            triggerSizeWarning();
            return;
        }

        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setQuantity(numValue);
            setHasChangedQuantity(true);
            setShowQuantityWarning(false);
            // Update sqm based on quantity
            if (selectedVariation && !isSampleVariation) {
                const calculatedSqm = quantityToSqm(numValue, selectedVariation.name);
                setSqm(calculatedSqm);
            }
        }
    };

    // Handle sqm change
    const handleSqmChange = (value: string) => {
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setSqm(numValue);
            setHasChangedQuantity(true);
            setShowQuantityWarning(false);
            // Update quantity based on sqm
            if (selectedVariation) {
                const calculatedQuantity = sqmToQuantity(numValue, selectedVariation.name);
                setQuantity(calculatedQuantity);
            }
        }
    };

    // Increment/Decrement handlers
    const incrementQuantity = () => {
        if (!selectedVariation && !isSampleVariation) {
            triggerSizeWarning();
            return;
        }

        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setHasChangedQuantity(true);
        setShowQuantityWarning(false);
        if (selectedVariation && !isSampleVariation) {
            const calculatedSqm = quantityToSqm(newQuantity, selectedVariation.name);
            setSqm(calculatedSqm);
        }
    };

    const decrementQuantity = () => {
        if (!selectedVariation && !isSampleVariation) {
            triggerSizeWarning();
            return;
        }

        const newQuantity = quantity > 0 ? quantity - 1 : 0;
        setQuantity(newQuantity);
        setHasChangedQuantity(true);
        if (selectedVariation && !isSampleVariation) {
            const calculatedSqm = quantityToSqm(newQuantity, selectedVariation.name);
            setSqm(calculatedSqm);
        }
    };

    const incrementSqm = () => {
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        const increment = getMinSqmIncrement(selectedVariation.name);
        const newSqm = parseFloat((sqm + increment).toFixed(2));
        setSqm(newSqm);
        setHasChangedQuantity(true);
        setShowQuantityWarning(false);

        const calculatedQuantity = sqmToQuantity(newSqm, selectedVariation.name);
        setQuantity(calculatedQuantity);
    };

    const decrementSqm = () => {
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        const increment = getMinSqmIncrement(selectedVariation.name);
        const newSqm = sqm > increment ? parseFloat((sqm - increment).toFixed(2)) : 0;
        setSqm(newSqm);
        setHasChangedQuantity(true);

        const calculatedQuantity = sqmToQuantity(newSqm, selectedVariation.name);
        setQuantity(calculatedQuantity);
    };

    // Handle wastage toggle - also updates quantity and sqm
    const handleWastageToggle = (checked: boolean) => {
        setAddWastage(checked);

        if (!selectedVariation || !hasChangedQuantity) return;

        if (checked) {
            // Add 10% wastage
            const newSqm = parseFloat((sqm * 1.1).toFixed(2));
            setSqm(newSqm);
            const calculatedQuantity = sqmToQuantity(newSqm, selectedVariation.name);
            setQuantity(calculatedQuantity);
        } else {
            // Remove 10% wastage (divide by 1.1 to get original)
            const newSqm = parseFloat((sqm / 1.1).toFixed(2));
            setSqm(newSqm);
            const calculatedQuantity = sqmToQuantity(newSqm, selectedVariation.name);
            setQuantity(calculatedQuantity);
        }
    };

    // Handle add to cart click
    const handleAddToCart = () => {
        // Check if variation is selected
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        // Check if quantity/sqm is entered
        if (!hasChangedQuantity || (isSampleVariation ? quantity === 0 : sqm === 0)) {
            triggerQuantityWarning();
            return;
        }

        // TODO: Add to cart implementation
    };

    // Show tile calculator warning
    const triggerTileCalcWarning = () => {
        setShowTileCalcWarning(true);
        setTimeout(() => setShowTileCalcWarning(false), 3000);
    };

    // For the Tile Calculator trigger
    const toggleTileCalculator = () => {
        // Block tile calculator for sample variations
        if (isSampleVariation) {
            triggerTileCalcWarning();
            return;
        }
        setOpenTileCalculator((prev) => !prev);
        setShowDeliveryEstimate(false); // Close the other
    };

    // For the Delivery Estimate trigger
    const toggleDeliveryEstimate = () => {
        setShowDeliveryEstimate((prev) => !prev);
        setOpenTileCalculator(false); // Close the other
    };


    if (isLoading || !product) {
        return (
            <div className='bg-destructive-foreground h-auto min-h-screen flex items-center justify-center px-4'>
                <p className='text-muted-foreground text-center'>Loading product...</p>
            </div>
        );
    }

    return (

        <div className='bg-destructive-foreground h-auto'>
            <div className='mx-auto py-6 md:py-12'>
                <div className="px-4 md:px-[4rem] lg:px-[4rem] xl:px-[4rem] py-[4rem] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-auto">
                    {/* Left column - Product images */}
                    <div className="w-full">
                        <SpPhotoSection product={product} />
                    </div>
                    {/* Right column - Product details & actions section */}
                    <div className="w-full lg:pl-4">
                        <SpProductDetails product={product} isTilingProduct={isTilingProduct} />
                        {/* Product variatons with chip design full width variation per tile per m2 */}
                        <SpVariations
                            isTilingProduct={!isTilingProduct}
                            variations={variations}
                            selectedVariation={selectedVariation}
                            piecePriceMap={piecePriceMap}
                            showSizeWarning={showSizeWarning}
                            showCustomCutForm={showCustomCutForm}
                            setShowCustomCutForm={setShowCustomCutForm}
                            applyVat={applyVat}
                            handleSelectedVariation={handleSelectedVariation}
                        />
                        {/* flex row quantity and sqm inputs with minus and plus indicators */}
                        <div className='w-full flex flex-col gap-2'>
                            {showQuantityWarning && (
                                <span className="text-sm text-destructive animate-shake bg-clay text-white px-4 py-1 rounded-xl w-fit">
                                    Quantity required
                                </span>
                            )}
                            <div className='w-full flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6'>
                                <strong className='text-xl md:text-2xl font-light sm:flex-3'>Select quantity</strong>
                                {!isTilingProduct && (
                                    <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
                                        <div className='relative'>
                                            <div
                                                onClick={() => toggleTileCalculator()}
                                                className='w-max flex items-center gap-2 cursor-pointer'
                                            >
                                                <CalculatorIcon className='w-6 h-6 md:w-7 md:h-7 text-emperador' />
                                                <span><p className='text-sm'>Tile Calculator</p></span>
                                            </div>
                                            <AnimatePresence>
                                                {showTileCalcWarning && (
                                                    <motion.span
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        className="absolute top-full left-0 mt-2 z-50 text-xs animate-shake bg-clay text-white px-3 py-1 rounded-xl whitespace-nowrap shadow-md"
                                                    >
                                                        Not available for samples
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className='w-max flex items-center gap-3 sm:gap-4 cursor-pointer relative transition-colors group'>
                                            <Switch onCheckedChange={handleWastageToggle} checked={addWastage} className='cursor-pointer group-hover:bg-emperador/50! transition-colors duration-150' />
                                            <span><p className='text-sm'>Add 10% wastage</p></span>
                                            <CircleQuestionMark onMouseLeave={() => setHoverPopup(false)} onMouseOver={() => setHoverPopup(!hoverPopup)} className='h-5 w-5 text-muted hover:text-emperador/70 duration-150' />
                                            {/* pop up  */}
                                            {hoverPopup && (
                                                <div className='absolute top-8 right-0 sm:right-0 bg-white w-64 sm:w-70 h-auto text-sm border border-dashed border-emperador/30 p-4 z-60'>
                                                    <div className='border-t border-r border-dashed border-emperador/30 w-3 h-3 -rotate-405 bg-white -top-2 absolute right-4 z-70' />
                                                    <p>We recommend adding 10% for cuts and breakages, to ensure you have enought for you project.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Calculator Section */}
                        <Calculator
                            isTilingProduct={!isTilingProduct}
                            isSampleVariation={!!isSampleVariation}
                            quantity={quantity}
                            sqm={sqm}
                            handleQuantityChange={handleQuantityChange}
                            handleSqmChange={handleSqmChange}
                            incrementQuantity={incrementQuantity}
                            decrementQuantity={decrementQuantity}
                            incrementSqm={incrementSqm}
                            decrementSqm={decrementSqm}
                        />
                        {/* Expandable Panels Section */}
                        <SpExpandablePanels
                            areaWidth={areaWidth}
                            areaLength={areaLength}
                            setAreaWidth={setAreaWidth}
                            setAreaLength={setAreaLength}
                            openTileCalculator={openTileCalculator}
                            showDeliveryEstimate={showDeliveryEstimate}
                            setOpenTileCalculator={setOpenTileCalculator}
                            setShowDeliveryEstimate={setShowDeliveryEstimate}
                            onCalculateArea={handleCalculateArea}
                        />

                        {/* Total Section */}
                        <SpTotalSection
                            totalPrice={totalPrice}
                            toggleVat={toggleVat}
                            handleToggleVat={handleToggleVat}
                            toggleDeliveryEstimate={toggleDeliveryEstimate}
                        />
                        {/* add to cart button full width */}
                        <Button onClick={handleAddToCart} className='w-full py-6 md:py-8 mt-6 md:mt-8 text-base md:text-lg uppercase'>Add to Cart</Button>
                    </div>
                </div>

                {/* Tiling Products Carousel */}
                {!isTilingProduct && <TilingProducts />}
                

                {/* May Also Like Section */}
                <MayAlsoLikeSection product={product} slug={product?.categories?.[0]?.slug} />
                                
                {/* NewsLetter Section */}
                <NewsletterSection />
            </div>
        </div>

    )
}

export default SingleProductPage