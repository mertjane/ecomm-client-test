'use client';

import { Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react';

interface SqmInputProps {
    sqm: number | '';
    handleSqmChange: (value: string) => void;
    handleSqmBlur: () => void;
    incrementSqm: () => void;
    decrementSqm: () => void;
}

const SqmInput = ({ sqm, handleSqmChange, handleSqmBlur, incrementSqm, decrementSqm }: SqmInputProps) => {

    // Local state to manage what the user SEES
    const [displayValue, setDisplayValue] = useState(sqm.toString());

    // 1. Sync local state with parent prop (handling +/- buttons)
    useEffect(() => {
        setDisplayValue(sqm.toString());
    }, [sqm]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        
        // Update what the user sees immediately
        setDisplayValue(val);

        // Update the parent (Calculator) logic
        // If empty, we send '0' so the calculator doesn't break
        // If not empty, we send the value
        handleSqmChange(val === '' ? '0' : val);
    };

    const handleFocus = () => {
        // Clear the visible input only
        setDisplayValue('');
        // Optional: If you want the calculator to treat it as 0 immediately on focus:
        // handleSqmChange('0'); 
    };

    const onInputBlur = () => {
        // If user left it empty, revert to '0' or the current sqm value visually
        if (displayValue === '') {
            setDisplayValue('0');
            handleSqmChange('0');
        } // 2. If it has a number, run the Parent's "Snap to Tile" calculation
        else {
            handleSqmBlur();
        }
    };

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
                >
                    <Minus className="w-4 h-4" />
                </button>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={displayValue}
                    onFocus={handleFocus}
                    onBlur={onInputBlur}
                    onChange={handleChange}
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
