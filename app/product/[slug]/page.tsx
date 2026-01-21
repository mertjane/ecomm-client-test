'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Calculator as CalculatorIcon, CircleQuestionMark } from 'lucide-react';
import Calculator from '@/app/components/calculator/Calculator';
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { setSelectedProduct } from '@/lib/redux/slices/selectedProductSlice';
import { addToCart, setCart } from '@/lib/redux/slices/cartSlice';
import { addToCart as apiAddToCart } from '@/lib/api/cart';
import { getProductBySlug } from '@/lib/api/products';
import { fetchProductVariations, ProductVariation } from '@/lib/api/variations';
import { sqmToQuantity, isMosaicVariation, extractMosaicDimensions } from '@/lib/utils/calculation';
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
    const [baseQuantity, setBaseQuantity] = useState<number>(0);
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
    const [isAdding, setIsAdding] = useState<boolean>(false);


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

    // console.log("Fetched variations data:", variations);

    // --- HELPER: Get Area of a single tile in Meters ---
    const getTileAreaInMeters = (variationName: string): number | null => {
        const dims = extractDimensions(variationName);
        if (!dims) return null;
        const [width, length] = dims;
        // Assuming width/length from extractDimensions are in mm. 
        // 1,000,000 mm^2 = 1 m^2
        return (width * length) / 1_000_000;
    }

    // Handle tile calculator - calculates area and updates sqm/quantity
    const handleCalculateArea = () => {
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        // Convert cm² to m²
        const calculatedSqm = (areaWidth * areaLength) / 10000;

        if (calculatedSqm > 0) {
            const tileArea = getTileAreaInMeters(selectedVariation.name);

            if (tileArea) {
                // 1. Calculate the raw tiles needed for the area (This is your BASE)
                const neededBaseTiles = Math.ceil(calculatedSqm / tileArea);
                
                // 2. CRITICAL FIX: Update the Base Quantity state
                setBaseQuantity(neededBaseTiles); 

                // 3. Calculate Final Quantity (Apply wastage if the switch is already ON)
                const finalQty = calculateTotalQuantity(neededBaseTiles, addWastage);
                setQuantity(finalQty);

                // 4. Calculate exact SQM based on the FINAL quantity
                const exactSqm = finalQty * tileArea;
                setSqm(parseFloat(exactSqm.toFixed(3))); 
            } else {
                // Fallback for non-standard variations
                
                // Calculate base quantity from the SQM logic
                const baseQty = sqmToQuantity(calculatedSqm, selectedVariation.name);
                setBaseQuantity(baseQty); // Fix: Update base

                // Calculate final quantity based on wastage switch
                const finalQty = calculateTotalQuantity(baseQty, addWastage);
                setQuantity(finalQty);

                // Set SQM (You might want to sync this to finalQty like above, but strictly:
                setSqm(parseFloat(calculatedSqm.toFixed(3)));
            }

            setHasChangedQuantity(true);
            setShowQuantityWarning(false);
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

        const isFreeSample = variation.name.toLowerCase().includes('free sample');

        if (isFreeSample) {
            setQuantity(0);
            setSqm(0);
            setHasChangedQuantity(false);
        } else {
            // Recalculate based on existing quantity if switching variation
            // We prioritize quantity to keep the "number of tiles" logic consistent
            const tileArea = getTileAreaInMeters(variation.name);
            if (tileArea && quantity > 0) {
                const newSqm = quantity * tileArea;
                setSqm(parseFloat(newSqm.toFixed(3))); // 3 decimals
            } else {
                setSqm(0);
                setQuantity(0);
            }
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

    // --- UPDATED HANDLERS FOR CLIENT REQUEST ---

    const calculateTotalQuantity = (base: number, isWastageOn: boolean) => {
        if (isWastageOn) {
            return Math.ceil(base * 1.1);
        }
        return base;
    };

    // Handle quantity change
    const handleQuantityChange = (value: string) => {
        if (!selectedVariation && !isSampleVariation) {
            triggerSizeWarning();
            return;
        }

        const numValue = parseInt(value); // This is the Total User Input

        if (!isNaN(numValue) && numValue >= 0) {
            // When user types in Quantity box, they are setting the FINAL amount.
            // We need to reverse-engineer the Base quantity if wastage is on.

            setQuantity(numValue); // Always update display immediately

            let calculatedBase = numValue;
            if (addWastage) {
                // If wastage is ON, and user types 110, Base is roughly 100.
                // We store this so if they turn wastage OFF later, it drops correctly.
                calculatedBase = Math.ceil(numValue / 1.1);
            }
            setBaseQuantity(calculatedBase);

            setHasChangedQuantity(true);
            setShowQuantityWarning(false);

            // Update SQM based on the displayed Quantity
            if (selectedVariation && !isSampleVariation) {
                const tileArea = getTileAreaInMeters(selectedVariation.name);
                if (tileArea) {
                    const exactSqm = numValue * tileArea;
                    setSqm(parseFloat(exactSqm.toFixed(3)));
                }
            }
        } else if (value === "") {
            setQuantity(0);
            setBaseQuantity(0);
            setSqm(0);
        }
    };


    const handleSqmChange = (value: string) => {
        if (!selectedVariation) {
            triggerSizeWarning();
            return;
        }

        // Allow empty string so user can delete everything
        if (value === "") {
            setSqm(0); // or maintain it as string if you have a separate local state, but 0 works for number types usually
            setQuantity(0);
            setBaseQuantity(0);
            return;
        }

        const inputValue = parseFloat(value);

        // Update the SQM state immediately so the input reflects what they type
        if (!isNaN(inputValue) && inputValue >= 0) {
            setSqm(inputValue);
            setHasChangedQuantity(true);
            setShowQuantityWarning(false);

            // OPTIONAL: You can update Quantity here roughly if you want them to see 
            // the tile count update while they type, but WITHOUT snapping the SQM back.
            const tileArea = getTileAreaInMeters(selectedVariation.name);
            if (tileArea) {
                const neededTiles = Math.ceil(inputValue / tileArea);
                setQuantity(neededTiles); // Update quantity visual
                setBaseQuantity(neededTiles); // Update base logic
                // CRITICAL: DO NOT CALL setSqm() with the recalculated value here.
            }
        }
    };

    const handleSqmBlur = () => {
        if (!selectedVariation || sqm === 0) return;

        const tileArea = getTileAreaInMeters(selectedVariation.name);

        if (tileArea) {
            // 1. Calculate how many whole tiles cover the CURRENT entered area
            // We use the current 'sqm' state which the user just finished typing
            const neededTiles = Math.ceil(sqm / tileArea);

            // 2. Calculate the ACTUAL area those tiles cover
            const exactSqm = neededTiles * tileArea;

            // 3. Update states to the "Snapped" values
            setBaseQuantity(neededTiles);
            setQuantity(neededTiles); // Or calculateTotalQuantity(neededTiles, addWastage) if needed
            setSqm(parseFloat(exactSqm.toFixed(3))); // NOW we force the 3 decimals
        } else {
            // Fallback: just ensure 3 decimals for non-tile products
            setSqm(parseFloat(sqm.toFixed(3)));
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
            const tileArea = getTileAreaInMeters(selectedVariation.name);
            if (tileArea) {
                const exactSqm = newQuantity * tileArea;
                setSqm(parseFloat(exactSqm.toFixed(3)));
            }
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
            const tileArea = getTileAreaInMeters(selectedVariation.name);
            if (tileArea) {
                const exactSqm = newQuantity * tileArea;
                setSqm(parseFloat(exactSqm.toFixed(3)));
            }
        }
    };


    // Handle wastage toggle - updates Quantity (add 10%), then recalculates SQM
    const handleWastageToggle = (checked: boolean) => {
        setAddWastage(checked);

        if (!selectedVariation) return;

        // We use the anchors (baseQuantity) to recalculate. 
        // We do NOT use 'quantity' to calculate the new 'quantity'.

        const newTotalQty = calculateTotalQuantity(baseQuantity, checked);
        setQuantity(newTotalQty);

        // Update SQM to match the new Total
        const tileArea = getTileAreaInMeters(selectedVariation.name);
        if (tileArea) {
            const newSqm = newTotalQty * tileArea;
            setSqm(parseFloat(newSqm.toFixed(3)));
        }
    };

    // Increment SQM (Increments by 1 full tile area now, or minimum increment)
    const incrementSqm = () => {
        const newQuantity = quantity + 1;
        handleQuantityChange(newQuantity.toString());
    };

    const decrementSqm = () => {
        const newQuantity = quantity > 0 ? quantity - 1 : 0;
        handleQuantityChange(newQuantity.toString());
    };


    // Handle add to cart click
    const handleAddToCart = async () => {
        // Check if product exists
        if (!product) return;

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

        if (isAdding) return; // Prevent double-clicks

        setIsAdding(true);

        try {
            // 1. Prepare the payload
            const payloadSqm = isSampleVariation ? 0 : Number(sqm);
            const priceString = selectedVariation.price;
            const productImage = product.images?.[0]?.src || '';
            const variationId = selectedVariation.id;

            const variationData = [{ attribute: "Size", value: selectedVariation.name }];

            // 2. Optimistic Update: Update Redux immediately for UI speed
            dispatch(
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: priceString,
                    quantity: quantity,
                    sqm: payloadSqm,
                    image: productImage,
                    slug: product.slug,
                    variation: variationData,
                    variationId: variationId,
                }),
            );

            // 3. Server Sync: Call the backend
            const response = await apiAddToCart({
                productId: product.id,
                quantity: quantity,
                sqm: payloadSqm,
                variation: variationData,
                variationId: variationId,
            });

            // 4. Update Redux with the "True" cart from server
            if (response && response.data) {
                dispatch(
                    setCart({
                        cart: response.data.cart,
                        cartHash: response.data.cartHash,
                    }),
                );
            }
        } catch (error) {
            console.error("Failed to add to cart", error);
        } finally {
            setIsAdding(false);
        }
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
                            handleSqmBlur={handleSqmBlur}
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