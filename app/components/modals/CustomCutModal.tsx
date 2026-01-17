'use client';


import React from 'react'


import { Ruler, X } from 'lucide-react';
interface CustomCutModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CustomCutModal = ({ isOpen, setIsOpen }: CustomCutModalProps) => {
  return (
      <div
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
      >
        {/* Modal Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Modal Content */}
        <div
          className={`relative bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
            }`}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-emperador/10 p-3 rounded-full mb-4">
              <Ruler className="w-8 h-8 text-emperador" />
            </div>
            <h3 className="text-2xl font-bold text-emperador mb-2">Custom Cutting Service</h3>
            <p className="text-muted-foreground text-sm">
              Need a specific size that isn't listed? We offer bespoke cutting services for all our natural stone products.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); /* Handle submit logic */ setIsOpen(false); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Width (mm)</label>
                <input type="number" placeholder="e.g. 600" className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-emperador focus:border-emperador outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Length (mm)</label>
                <input type="number" placeholder="e.g. 900" className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-emperador focus:border-emperador outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Quantity Required</label>
              <input type="number" placeholder="Total tiles needed" className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-emperador focus:border-emperador outline-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input type="email" placeholder="your@email.com" required className="w-full h-10 px-3 border border-border rounded-md focus:ring-1 focus:ring-emperador focus:border-emperador outline-none" />
            </div>

            <button type="submit" className="w-full bg-emperador hover:bg-emperador/90 text-white font-semibold py-3 rounded-md transition-colors mt-4">
              Request Quote
            </button>
          </form>
        </div>
      </div>
  )
}

export default CustomCutModal