'use client';

import { Switch } from '@/components/ui/switch';
import { CircleQuestionMark } from 'lucide-react';

interface SpTotalSectionProps {
    totalPrice: number;
    toggleVat: boolean;
    handleToggleVat: (checked: boolean) => void;
    toggleDeliveryEstimate: () => void;
}

const SpTotalSection = ({
    totalPrice,
    toggleVat,
    handleToggleVat,
    toggleDeliveryEstimate,
}: SpTotalSectionProps) => {
    return (
        <div className='w-full flex items-end gap-6'>
            <div className='flex flex-4 flex-col leading-tight'>
                <strong className='text-2xl font-light'>Total</strong>
                <strong className='text-4xl font-light'>£{totalPrice.toFixed(2)}</strong>
            </div>
            <div onClick={() => toggleDeliveryEstimate()} className='w-max flex items-center justify-end  gap-2 cursor-pointer'>
                <CircleQuestionMark className='h-6 w-6 text-emperador' />
                <span><p className='text-sm'>Delivery estimate</p></span>
            </div>
            <div className='w-max flex items-center justify-end pr-4 gap-2 cursor-pointer transition-colors group'>
                <Switch onCheckedChange={handleToggleVat} checked={toggleVat} className='cursor-pointer group-hover:bg-emperador/50! transition-colors duration-150' />
                <span><p className='text-sm'>VAT</p></span>
            </div>
        </div>
    )
}

export default SpTotalSection
