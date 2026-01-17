'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface SpExpandablePanelsProps {
    areaWidth: number;
    areaLength: number;
    openTileCalculator: boolean;
    showDeliveryEstimate: boolean;
    setAreaWidth: (value: number) => void;
    setAreaLength: (value: number) => void;
    setOpenTileCalculator: (value: boolean) => void;
    setShowDeliveryEstimate: (value: boolean) => void;
    onCalculateArea: () => void;
}

const SpExpandablePanels = ({
    areaWidth,
    areaLength,
    openTileCalculator,
    showDeliveryEstimate,
    setAreaWidth,
    setAreaLength,
    setOpenTileCalculator,
    setShowDeliveryEstimate,
    onCalculateArea,
}: SpExpandablePanelsProps) => {
    return (
        <AnimatePresence mode='wait'>
            {openTileCalculator ? (
                <motion.div
                    key="tile-calculator-panel"
                    initial={{ maxHeight: 0, y: -10 }}
                    animate={{
                        maxHeight: 1000,
                        y: 0
                    }}
                    exit={{
                        maxHeight: 0,
                        y: -10
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.36, 1, 0.36, 1]
                    }}
                    className="overflow-hidden w-full"
                >
                    <div className='mt-4 w-full border border-dashed relative border-emperador/30 bg-emperador/5 rounded-lg p-4'>
                        <h3 className='text-lg font-light mb-4'>Calculate the amount of tiles you need</h3>

                        <X
                            onClick={() => setOpenTileCalculator(false)}
                            className='h-5 w-5 absolute top-4 right-4 hover:text-emperador/70 cursor-pointer'
                        />

                        <p className='text-sm text-foreground/80'>
                            Calculate the number of tiles and total area required for your project based on room dimensions.
                        </p>

                        <div className='flex md:gap-4 gap-2 mt-4 items-center'>
                            <div className='flex-1 relative'>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={areaWidth || ''}
                                    onChange={(e) => setAreaWidth(Number(e.target.value) || 0)}
                                    className='w-full h-10 text-center pr-10 border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-emperador/20'
                                />
                                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>cm</span>
                            </div>

                            <span className='text-muted-foreground'>x</span>

                            <div className='flex-1 relative'>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={areaLength || ''}
                                    onChange={(e) => setAreaLength(Number(e.target.value) || 0)}
                                    className='w-full h-10 text-center pr-10 border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-emperador/20'
                                />
                                <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'>cm</span>
                            </div>

                            <div className='flex-1'>
                                <button onClick={onCalculateArea} className="w-full bg-emperador text-sm md:text-md px-2 h-10 w-max text-sm text-white rounded-md hover:bg-emperador/90 transition-colors">
                                    Update Quantity
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : showDeliveryEstimate ? (
                <motion.div
                    key="delivery-estimate-panel"
                    initial={{ maxHeight: 0, y: -10 }}
                    animate={{
                        maxHeight: 1000,
                        y: 0
                    }}
                    exit={{
                        maxHeight: 0,
                        y: -10
                    }}
                    transition={{
                        duration: 0.5,
                        ease: [0.36, 1, 0.36, 1]
                    }}
                    className="overflow-hidden w-full"
                >
                    <div className='mt-4 w-full border border-dashed relative border-emperador/30 bg-emperador/5 rounded-lg p-4'>
                        <h3 className='text-lg font-light mb-4'>Delivery estimate</h3>

                        <X
                            onClick={() => setShowDeliveryEstimate(false)}
                            className='h-5 w-5 absolute top-4 right-4 hover:text-emperador/70 cursor-pointer'
                        />

                        <p className='text-sm text-foreground/80'>
                            Calculate the number of tiles and total area required for your project based on room dimensions.
                        </p>

                        <div className='flex gap-4 mt-4 items-center'>
                            <div className='flex-1 relative flex items-center gap-4'>
                                <input type="text" placeholder="Enter postcode" className='w-full h-10 text-center pr-10 border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-emperador/20' />
                                <button className="w-full bg-emperador text-white h-10 rounded-md hover:bg-emperador/90 transition-colors">
                                    Calculate
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

export default SpExpandablePanels