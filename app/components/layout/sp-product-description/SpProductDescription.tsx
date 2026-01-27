'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Product } from '@/types/product';

interface SpProductDescriptionProps {
  product: Product;
}

type TabType = 'description' | 'specifications' | null;

const SpProductDescription = ({ product }: SpProductDescriptionProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(null);

  const toggleTab = (tab: TabType) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  // Decode HTML entities
  const decodeHtmlEntities = (html: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  };

  // Parse HTML description safely with decoded entities
  const createMarkup = (html: string) => {
    return { __html: decodeHtmlEntities(html) };
  };

  // Helper to check if a value is valid (not empty, not "0", not 0)
  const isValidValue = (value: string | undefined) => {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== '0';
  };

  // Check if we have content to display
  const hasDescription = product.description && product.description.trim() !== '';
  const hasShortDescription = product.short_description && product.short_description.trim() !== '';
  const hasAttributes = product.attributes && product.attributes.length > 0;
  const hasWeight = isValidValue(product.weight);
  const hasDimensions = product.dimensions && (
    isValidValue(product.dimensions.length) ||
    isValidValue(product.dimensions.width) ||
    isValidValue(product.dimensions.height)
  );
  const hasSku = product.sku && product.sku !== '';

  // Check if specifications tab should show
  const hasSpecifications = hasAttributes || hasWeight || hasDimensions || hasSku;

  // If no content at all, don't render
  if (!hasDescription && !hasShortDescription && !hasSpecifications) {
    return null;
  }

  return (
    <div className="w-full mt-8 md:mt-12 px-4 md:px-[4rem] lg:px-[4rem] xl:px-[4rem] ">
      {/* Description Accordion */}
      {(hasDescription || hasShortDescription) && (
        <div className="border-b border-border">
          <button
            onClick={() => toggleTab('description')}
            className="w-full py-4 md:py-6 flex items-center justify-between text-left group"
          >
            <span className="text-base md:text-lg font-medium uppercase tracking-wide">
              Description
            </span>
            <motion.div
              animate={{ rotate: activeTab === 'description' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-emperador transition-colors" />
            </motion.div>
          </button>

          <AnimatePresence>
            {activeTab === 'description' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.36, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pb-6 md:pb-8 space-y-4 max-w-4xl">
                  {/* Short Description */}
                  {hasShortDescription && (
                    <div
                      className="text-foreground/80 text-sm md:text-base leading-relaxed prose prose-sm md:prose-base max-w-none
                        prose-p:my-2 prose-ul:my-2 prose-li:my-0.5"
                      dangerouslySetInnerHTML={createMarkup(product.short_description!)}
                    />
                  )}

                  {/* Full Description */}
                  {hasDescription && (
                    <div
                      className="text-foreground/80 text-sm md:text-base leading-relaxed prose prose-sm md:prose-base max-w-none
                        prose-p:my-2 md:prose-p:my-3 prose-ul:my-2 prose-li:my-0.5 prose-h2:text-lg prose-h2:font-medium prose-h2:mt-4
                        prose-h3:text-base prose-h3:font-medium prose-h3:mt-3"
                      dangerouslySetInnerHTML={createMarkup(product.description!)}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Specifications Accordion */}
      {hasSpecifications && (
        <div className="border-b border-border">
          <button
            onClick={() => toggleTab('specifications')}
            className="w-full py-4 md:py-6 flex items-center justify-between text-left group"
          >
            <span className="text-base md:text-lg font-medium uppercase tracking-wide">
              Specifications
            </span>
            <motion.div
              animate={{ rotate: activeTab === 'specifications' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-emperador transition-colors" />
            </motion.div>
          </button>

          <AnimatePresence>
            {activeTab === 'specifications' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.36, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pb-6 md:pb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 lg:gap-x-12 gap-y-3">
                    {/* SKU */}
                    {hasSku && (
                      <div className="flex items-start gap-3 py-2.5 border-b border-border/50">
                        <span className="text-muted-foreground text-sm min-w-[100px] lg:min-w-[110px]">
                          SKU
                        </span>
                        <span className="text-foreground text-sm font-medium">
                          {product.sku}
                        </span>
                      </div>
                    )}

                    {/* Weight */}
                    {hasWeight && (
                      <div className="flex items-start gap-3 py-2.5 border-b border-border/50">
                        <span className="text-muted-foreground text-sm min-w-[100px] lg:min-w-[110px]">
                          Weight
                        </span>
                        <span className="text-foreground text-sm font-medium">
                          {product.weight} kg
                        </span>
                      </div>
                    )}

                    {/* Dimensions */}
                    {hasDimensions && (
                      <div className="flex items-start gap-3 py-2.5 border-b border-border/50">
                        <span className="text-muted-foreground text-sm min-w-[100px] lg:min-w-[110px]">
                          Dimensions
                        </span>
                        <span className="text-foreground text-sm font-medium">
                          {[
                            product.dimensions?.length,
                            product.dimensions?.width,
                            product.dimensions?.height
                          ].filter(val => isValidValue(val)).join(' x ')} cm
                        </span>
                      </div>
                    )}

                    {/* Product Attributes */}
                    {hasAttributes && product.attributes.map((attr, index) => (
                      <div
                        key={attr.id || index}
                        className="flex items-start gap-3 py-2.5 border-b border-border/50"
                      >
                        <span className="text-muted-foreground text-sm min-w-[100px] lg:min-w-[110px]">
                          {attr.name}
                        </span>
                        <span className="text-foreground text-sm font-medium">
                          {attr.options.join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default SpProductDescription;
