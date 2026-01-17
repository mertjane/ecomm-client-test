'use client';

import QtyInput from './QtyInput';
import SqmInput from './SqmInput';

interface CalculatorProps {
    isTilingProduct?: boolean;
    isSampleVariation: boolean;
    quantity: number;
    sqm: number;
    handleQuantityChange: (value: string) => void;
    handleSqmChange: (value: string) => void;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
    incrementSqm: () => void;
    decrementSqm: () => void;
}

const Calculator = ({
    isTilingProduct,
    isSampleVariation,
    quantity,
    sqm,
    handleQuantityChange,
    handleSqmChange,
    incrementQuantity,
    decrementQuantity,
    incrementSqm,
    decrementSqm,
}: CalculatorProps) => {
    return (
        <div className={isSampleVariation || !isTilingProduct ? "my-4 w-full" : "my-4 flex items-center w-full gap-4"}>
            <QtyInput
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
            />
            {!isSampleVariation && isTilingProduct && (
                <SqmInput
                    sqm={sqm}
                    handleSqmChange={handleSqmChange}
                    incrementSqm={incrementSqm}
                    decrementSqm={decrementSqm}
                />
            )}
        </div>
    )
}

export default Calculator
