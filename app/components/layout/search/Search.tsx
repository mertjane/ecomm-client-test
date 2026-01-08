
// 'use client';

// import { useEffect } from 'react';
// import { X } from 'lucide-react';
// import { useSearch } from '@/lib/hooks/useSearch';
// import { SearchInput } from './SearchInput';
// import { SearchSuggestions } from './SearchSuggestions';
// import { SearchResults } from './SearchResults';
// import { PopularProducts } from './PopularProducts';

// export function Search() {
//   const { isOpen, query, closeSearch } = useSearch();

//   // Prevent body scroll when search is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }

//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   // Close on Escape key
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && isOpen) {
//         closeSearch();
//       }
//     };

//     window.addEventListener('keydown', handleEscape);
//     return () => window.removeEventListener('keydown', handleEscape);
//   }, [isOpen, closeSearch]);

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-300"
//         onClick={closeSearch}
//       />

//       {/* Search Panel */}
//       <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-background shadow-2xl animate-in slide-in-from-top duration-300 flex flex-col">
//         {/* Header */}
//         <div className="border-b border-border p-4 md:p-6">
//           <div className="max-w-4xl mx-auto flex items-center gap-4">
//             <SearchInput />
//             <button
//               onClick={closeSearch}
//               className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
//               aria-label="Close search"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         {/* Content - Scrollable */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
//             {query.length < 3 ? (
//               // Show popular products before searching (query < 3 chars)
//               <div className="space-y-8">
//                 <SearchSuggestions />
//                 <PopularProducts />
//               </div>
//             ) : (
//               // Show search results when query >= 3 chars
//               <div className="space-y-8">
//                 <SearchSuggestions />
//                 <SearchResults />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
