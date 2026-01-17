'use client';

import React from 'react'
import { Minus, Plus } from 'lucide-react';

interface QtyInputProps {
    quantity: number;
    handleQuantityChange: (value: string) => void;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
}

const QtyInput = ({ quantity, handleQuantityChange, incrementQuantity, decrementQuantity }: QtyInputProps) => {
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
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
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
