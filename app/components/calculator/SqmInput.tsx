'use client';

import { Minus, Plus } from 'lucide-react'
import React from 'react'

interface SqmInputProps {
    sqm: number;
    handleSqmChange: (value: string) => void;
    incrementSqm: () => void;
    decrementSqm: () => void;
}

const SqmInput = ({ sqm, handleSqmChange, incrementSqm, decrementSqm }: SqmInputProps) => {
    return (
        <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-foreground block">
                SQM
            </label>
            <div className="relative flex items-center">
                <button
                    onClick={decrementSqm}
                    className="absolute left-0 z-10 h-12 px-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Decrease sqm"
                    disabled={sqm <= 0}
                >
                    <Minus className="w-4 h-4" />
                </button>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={sqm || 0}
                    onChange={(e) => handleSqmChange(e.target.value)}
                    className="w-full h-14 text-center border border-border rounded-lg bg-background px-12 focus:outline-none focus:ring-2 focus:ring-emperador focus:border-emperador transition-all"
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

    )
}

export default SqmInput
