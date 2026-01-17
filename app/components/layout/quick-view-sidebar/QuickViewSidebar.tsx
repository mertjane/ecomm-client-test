'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, PencilRuler, Ruler } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeQuickView } from '@/lib/redux/slices/quickViewSlice';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import { parsePriceFromHtml } from '@/lib/utils/price';
import { quantityToSqm, sqmToQuantity, getMinSqmIncrement } from '@/lib/utils/calculation';
import { fetchProductVariations, type ProductVariation } from '@/lib/api/variations';
import Image from 'next/image';
import CustomCutModal from '../../modals/CustomCutModal';
import CustomCutTrigger from '../custom-cut-trigger/CustomCutTrigger';

export function QuickViewSidebar() {
  const dispatch = useAppDispatch();
  const { isOpen, product } = useAppSelector((state) => state.quickView);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sqm, setSqm] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [showVariationWarning, setShowVariationWarning] = useState(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [hasChangedQuantity, setHasChangedQuantity] = useState(false);
  const [isCustomCutOpen, setIsCustomCutOpen] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      console.log('Product opened:', product.name);
      console.log('Product ID:', product.id);
      console.log('Product variations field:', product.variations);
      console.log('Has variations?', product.variations && product.variations.length > 0);

      setCurrentImageIndex(0);
      setQuantity(1);
      setSqm(1);
      setSelectedVariation('');
      setCurrentPrice(parsePriceFromHtml(product.price_html || ''));
      setVariations([]);
      setHasChangedQuantity(false);
      setIsCustomCutOpen(false);

      // Fetch variations if product has attributes (indicates it might have variations)
      // We check for attributes instead of variations array because the variations array
      // might be empty in list responses but the product still has variations
      const hasVariationAttributes = product.attributes && product.attributes.some(attr =>
        attr.variation === true || attr.name.toLowerCase().includes('size')
      );

      if (hasVariationAttributes || (product.variations && product.variations.length > 0)) {
        console.log('Fetching variations for product ID:', product.id);
        setLoadingVariations(true);
        fetchProductVariations(product.id)
          .then((fetchedVariations) => {
            console.log('Successfully fetched variations:', fetchedVariations);
            setVariations(fetchedVariations);
          })
          .catch((error) => {
            console.error('Failed to fetch variations:', error);
          })
          .finally(() => {
            setLoadingVariations(false);
          });
      } else {
        console.log('No variations to fetch - product has no variation attributes');
      }
    }
  }, [product]);

  // Update price when variation changes
  useEffect(() => {
    if (!product) return;

    if (!selectedVariation) {
      setCurrentPrice(parsePriceFromHtml(product.price_html || ''));
      return;
    }

    console.log('Selected variation:', selectedVariation);
    console.log('Available variations:', variations);

    // Find matching variation from fetched variations
    if (variations && variations.length > 0) {
      const variation = variations.find((v) => {
        const sizeAttr = v.attributes.find((attr) =>
          attr.name.toLowerCase().includes('size') || attr.name.toLowerCase() === 'sizemm'
        );
        return sizeAttr && sizeAttr.option === selectedVariation;
      });

      if (variation) {
        console.log('Found variation with price:', variation.price);
        const price = parseFloat(variation.price);
        setCurrentPrice(isNaN(price) ? parsePriceFromHtml(product.price_html || '') : price);
        return;
      }
    }

    // Fallback to base product price
    console.log('Using base product price');
    setCurrentPrice(parsePriceFromHtml(product.price_html || ''));
  }, [selectedVariation, product, variations]);


  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen || isCustomCutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isCustomCutOpen]);

  if (!product) return null;

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  // Check if selected variation is a sample
  const isSampleVariation = selectedVariation &&
    (selectedVariation.toLowerCase().includes('sample') ||
      selectedVariation.toLowerCase().includes('full size sample') ||
      selectedVariation.toLowerCase().includes('free sample'));

  // Calculate total price (for samples: quantity × price, for regular: sqm × price per sqm)
  const totalPrice = isSampleVariation ? quantity * currentPrice : sqm * currentPrice;
  const showTotalInButton = hasChangedQuantity && currentPrice > 0 && (isSampleVariation ? quantity > 0 : sqm > 0);

  const handleClose = () => {
    dispatch(closeQuickView());
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price_html),
        quantity,
        image: images[0]?.src || '',
        slug: product.slug,
        variation: selectedVariation || undefined,
      } as any)
    );
    // Show success feedback (you can add a toast notification here)
    handleClose();
  };

  const showWarning = () => {
    setShowVariationWarning(true);
    setTimeout(() => setShowVariationWarning(false), 3000);
  };

  const handleQuantityChange = (value: string) => {
    if (!selectedVariation && !isSampleVariation) {
      showWarning();
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(numValue);
      setHasChangedQuantity(true);
      // Update sqm based on quantity
      if (selectedVariation && !isSampleVariation) {
        const calculatedSqm = quantityToSqm(numValue, selectedVariation);
        setSqm(calculatedSqm);
      }
    }
  };

  const handleSqmChange = (value: string) => {
    if (!selectedVariation) {
      showWarning();
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSqm(numValue);
      setHasChangedQuantity(true);
      // Update quantity based on sqm
      if (selectedVariation) {
        const calculatedQuantity = sqmToQuantity(numValue, selectedVariation);
        setQuantity(calculatedQuantity);
      }
    }
  };

  const incrementQuantity = () => {
    if (!selectedVariation && !isSampleVariation) {
      showWarning();
      return;
    }

    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setHasChangedQuantity(true);
    // Update sqm based on new quantity
    if (selectedVariation && !isSampleVariation) {
      const calculatedSqm = quantityToSqm(newQuantity, selectedVariation);
      setSqm(calculatedSqm);
    }
  };

  const decrementQuantity = () => {
    if (!selectedVariation && !isSampleVariation) {
      showWarning();
      return;
    }

    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    setHasChangedQuantity(true);
    // Update sqm based on new quantity
    if (selectedVariation && !isSampleVariation) {
      const calculatedSqm = quantityToSqm(newQuantity, selectedVariation);
      setSqm(calculatedSqm);
    }
  };

  const incrementSqm = () => {
    if (!selectedVariation) {
      showWarning();
      return;
    }

    const increment = getMinSqmIncrement(selectedVariation);
    const newSqm = parseFloat((sqm + increment).toFixed(2));
    setSqm(newSqm);
    setHasChangedQuantity(true);

    // Update quantity based on new sqm
    const calculatedQuantity = sqmToQuantity(newSqm, selectedVariation);
    setQuantity(calculatedQuantity);
  };

  const decrementSqm = () => {
    if (!selectedVariation) {
      showWarning();
      return;
    }

    const increment = getMinSqmIncrement(selectedVariation);
    const newSqm = sqm > increment ? parseFloat((sqm - increment).toFixed(2)) : increment;
    setSqm(newSqm);
    setHasChangedQuantity(true);

    // Update quantity based on new sqm
    const calculatedQuantity = sqmToQuantity(newSqm, selectedVariation);
    setQuantity(calculatedQuantity);
  };

  if (!isOpen && !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] lg:w-[600px] bg-background z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-emperador">Quick View</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Close quick view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Image Carousel */}
            <div className="relative aspect-square bg-muted">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[currentImageIndex].src}
                    alt={images[currentImageIndex].alt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />

                  {/* Image Navigation */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-emperador" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-emperador" />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
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

            {/* Product Details */}
            <div className="p-6 space-y-6">
              {/* Name and Price */}
              <div>
                <h3 className="text-2xl font-semibold text-emperador mb-2">{product.name}</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-foreground">
                    £{currentPrice.toFixed(2)}
                  </p>
                  <span className="text-sm text-muted-foreground">per sqm</span>
                </div>
              </div>

              {/* Variations - Only showing sizemm */}
              {product.attributes && product.attributes.filter(attr => attr.name.toLowerCase() === 'sizemm').length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Select Size
                    </label>
                    {showVariationWarning && (
                      <span className="text-sm text-destructive animate-shake bg-clay text-white px-4 py-0.5 rounded-xl">
                        Please select a variation first
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {product.attributes
                      .filter(attr => attr.name.toLowerCase() === 'sizemm')
                      .map((attr, index) => (
                        <div key={index}>
                          <div className="flex flex-wrap gap-2">
                            {attr.options.map((option) => (
                              <label
                                key={option}
                                className="flex items-center cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="variation"
                                  value={option}
                                  checked={selectedVariation === option}
                                  onChange={(e) => {
                                    const newVariation = e.target.value;
                                    setSelectedVariation(newVariation);

                                    // Recalculate sqm when variation changes
                                    const calculatedSqm = quantityToSqm(quantity, newVariation);
                                    setSqm(calculatedSqm);
                                  }}
                                  className="sr-only peer"
                                />
                                <div className="px-4 py-2 border rounded-md transition-all peer-checked:border-emperador peer-checked:bg-emperador/5 peer-checked:text-emperador hover:border-emperador/50">
                                  {option}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity and SQM Inputs */}
              <div className={isSampleVariation ? "w-full" : "grid grid-cols-2 gap-4"}>
                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground block">
                    Quantity
                  </label>
                  <div className="relative flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="absolute left-0 z-10 h-12 px-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-full h-12 text-center border border-border rounded-lg bg-background px-12 focus:outline-none focus:ring-2 focus:ring-emperador focus:border-emperador transition-all"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="absolute right-0 z-10 h-12 px-3 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* SQM Input - Hidden for samples */}
                {!isSampleVariation && ( 
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground block">
                      SQM
                    </label>
                    <div className="relative flex items-center">
                      <button
                        onClick={decrementSqm}
                        className="absolute left-0 z-10 h-12 px-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease sqm"
                        disabled={sqm <= 0.5}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={sqm}
                        onChange={(e) => handleSqmChange(e.target.value)}
                        className="w-full h-12 text-center border border-border rounded-lg bg-background px-12 focus:outline-none focus:ring-2 focus:ring-emperador focus:border-emperador transition-all"
                      />
                      <button
                        onClick={incrementSqm}
                        className="absolute right-0 z-10 h-12 px-3 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Increase sqm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-emperador hover:bg-emperador/90 text-white py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                {showTotalInButton ? (
                  <>
                    <span className="text-lg">£{totalPrice.toFixed(2)}</span>
                    <span className="text-sm opacity-90">- Add to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              {/* CUSTOM CUT TRIGGER SECTION */}
              <CustomCutTrigger setIsOpen={setIsCustomCutOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Cut Modal Section */}
      <CustomCutModal isOpen={isCustomCutOpen} setIsOpen={setIsCustomCutOpen} />
    </>
  );
}
