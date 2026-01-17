import React from 'react'

import { PencilRuler, ChevronRight } from 'lucide-react';

interface CustomCutTriggerProps {
    setIsOpen: (open: boolean) => void;
}

const CustomCutTrigger = ({ setIsOpen }: CustomCutTriggerProps) => {
    return (
        <div
            onClick={() => setIsOpen(true)}
            className="w-full border border-dashed border-emperador/30 bg-emperador/5 rounded-lg p-4 cursor-pointer hover:bg-emperador/10 transition-colors group mt-4"
        >
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-white p-2.5 rounded-full shadow-sm border border-emperador/10 group-hover:scale-110 transition-transform">
                    <div className="relative">

                        <PencilRuler className="w-5 h-5 text-emperador relative z-10" />

                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-emperador tracking-wider uppercase">Can't find your size?</span>
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">We can cut any sizes</span>
                </div>
                <ChevronRight className="w-5 h-5 text-emperador/50 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    )
}

export default CustomCutTrigger