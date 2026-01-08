// 'use client';

// import { useEffect, useState } from 'react';
// import { FilterButton } from './FilterButton';
// import { SortDropdown } from './SortDropdown';
// import { getMaterialForCategory } from '@/lib/utils/category-material-mapping';
// import type { FilterOptions, SelectedFilters, SortOption } from '@/types/product';

// interface ProductActionsBarProps {
//   totalProducts: number;
//   sortBy: SortOption;
//   filters: SelectedFilters;
//   filterOptions?: FilterOptions;
//   isLoadingOptions?: boolean;
//   onSortChange: (sortBy: SortOption) => void;
//   onFilterChange: (filterType: keyof SelectedFilters, value: string) => void;
//   onClearFilters?: () => void;
//   currentCategory?: string; // Category slug for smart filtering
// }

// export function ProductActionsBar({
//   totalProducts,
//   sortBy,
//   filters,
//   filterOptions,
//   isLoadingOptions = false,
//   onSortChange,
//   onFilterChange,
//   onClearFilters,
//   currentCategory,
// }: ProductActionsBarProps) {
//   const hasActiveFilters =
//     (filters?.material?.length ?? 0) > 0 ||
//     (filters?.roomType?.length ?? 0) > 0 ||
//     (filters?.colour?.length ?? 0) > 0 ||
//     (filters?.finish?.length ?? 0) > 0;

//   const [isScrolled, setIsScrolled] = useState(false);

//   // Determine if this category has a locked material
//   const lockedMaterial = currentCategory ? getMaterialForCategory(currentCategory) : undefined;

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="w-full bg-background border-b border-border z-40">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           {/* Filters */}
//           <div className="flex flex-wrap items-center gap-3">
//             {isLoadingOptions ? (
//               <span className="text-sm text-muted-foreground">Loading filters...</span>
//             ) : (
//               <>
//                 {filterOptions?.material && filterOptions.material.length > 0 && (
//                   <FilterButton
//                     label="Material"
//                     options={filterOptions.material.map((opt) => opt.name)}
//                     selectedValues={
//                       filters?.material?.map((slug) => {
//                         const option = filterOptions.material.find((opt) => opt.slug === slug);
//                         return option ? option.name : slug;
//                       }) || []
//                     }
//                     onToggle={(value) => {
//                       const option = filterOptions.material.find((opt) => opt.name === value);
//                       if (option) {
//                         onFilterChange('material', option.slug);
//                       }
//                     }}
//                     lockedValue={lockedMaterial}
//                   />
//                 )}
//                 {filterOptions?.roomType && filterOptions.roomType.length > 0 && (
//                   <FilterButton
//                     label="Room Type"
//                     options={filterOptions.roomType.map((opt) => opt.name)}
//                     selectedValues={
//                       filters?.roomType?.map((slug) => {
//                         const option = filterOptions.roomType.find((opt) => opt.slug === slug);
//                         return option ? option.name : slug;
//                       }) || []
//                     }
//                     onToggle={(value) => {
//                       const option = filterOptions.roomType.find((opt) => opt.name === value);
//                       if (option) {
//                         onFilterChange('roomType', option.slug);
//                       }
//                     }}
//                   />
//                 )}
//                 {filterOptions?.finish && filterOptions.finish.length > 0 && (
//                   <FilterButton
//                     label="Finish"
//                     options={filterOptions.finish.map((opt) => opt.name)}
//                     selectedValues={
//                       filters?.finish?.map((slug) => {
//                         const option = filterOptions.finish.find((opt) => opt.slug === slug);
//                         return option ? option.name : slug;
//                       }) || []
//                     }
//                     onToggle={(value) => {
//                       const option = filterOptions.finish.find((opt) => opt.name === value);
//                       if (option) {
//                         onFilterChange('finish', option.slug);
//                       }
//                     }}
//                   />
//                 )}
//                 {filterOptions?.colour && filterOptions.colour.length > 0 && (
//                   <FilterButton
//                     label="Colour"
//                     options={filterOptions.colour.map((opt) => opt.name)}
//                     selectedValues={
//                       filters?.colour?.map((slug) => {
//                         const option = filterOptions.colour.find((opt) => opt.slug === slug);
//                         return option ? option.name : slug;
//                       }) || []
//                     }
//                     onToggle={(value) => {
//                       const option = filterOptions.colour.find((opt) => opt.name === value);
//                       if (option) {
//                         onFilterChange('colour', option.slug);
//                       }
//                     }}
//                   />
//                 )}
//                 {hasActiveFilters && onClearFilters && (
//                   <button
//                     onClick={onClearFilters}
//                     className="text-sm text-destructive hover:underline"
//                   >
//                     Clear all filters
//                   </button>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Product Count and Sort */}
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-muted-foreground whitespace-nowrap">
//               {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
//             </span>
//             <SortDropdown
//               value={sortBy}
//               onChange={(value) => {
//                 onSortChange(value as SortOption);
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
