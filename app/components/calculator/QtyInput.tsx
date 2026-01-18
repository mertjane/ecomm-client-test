'use client';

import React, { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react';

interface QtyInputProps {
    quantity: number;
    handleQuantityChange: (value: string) => void;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
}

const QtyInput = ({ quantity, handleQuantityChange, incrementQuantity, decrementQuantity }: QtyInputProps) => {

    // Local state to manage what the user SEES
        const [displayValue, setDisplayValue] = useState(quantity.toString());
    
        // 1. Sync local state with parent prop (handling +/- buttons)
        useEffect(() => {
            setDisplayValue(quantity.toString());
        }, [quantity]);
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            
            // Update what the user sees immediately
            setDisplayValue(val);
    
            // Update the parent (Calculator) logic
            // If empty, we send '0' so the calculator doesn't break
            // If not empty, we send the value
            handleQuantityChange(val === '' ? '0' : val);
        };
    
        const handleFocus = () => {
            // Clear the visible input only
            setDisplayValue('');
            // Optional: If you want the calculator to treat it as 0 immediately on focus:
            // handleSqmChange('0'); 
        };
    
        const handleBlur = () => {
            // If user left it empty, revert to '0' or the current sqm value visually
            if (displayValue === '') {
                setDisplayValue('0');
                handleQuantityChange('0');
            }
        };

    return (
        <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-foreground block">
                Quantity
            </label>
            <div className="relative flex items-center">
                <button
                    onClick={decrementQuantity}
                    className="absolute left-0 z-10 h-12 px-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 0}
                >
                    <Minus className="w-4 h-4" />
                </button>
                <input
                    type="number"
                    min="0"
                    value={displayValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="w-full h-14 text-center border border-border rounded-lg bg-background px-12 focus:outline-none focus:ring-2 focus:ring-emperador focus:border-emperador transition-all"
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
    )
}

export default QtyInput
