// import { useCallback, useEffect, useRef } from 'react';
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import {
//   setQuery,
//   setSearching,
//   setSearchResults,
//   setSuggestions,
//   setError,
//   openSearch,
//   closeSearch,
// } from '../redux/slices/searchSlice';
// import { searchApi } from '../api/search';

// const DEBOUNCE_DELAY = 500; // 500ms delay for search
// const SUGGESTION_DELAY = 300; // 300ms delay for suggestions

// export function useSearch() {
//   const dispatch = useAppDispatch();
//   const searchState = useAppSelector((state) => state.search);

//   const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
//   const suggestionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

//   /**
//    * Perform the actual search
//    */
//   const performSearch = useCallback(
//     async (query: string, page: number = 1) => {
//       if (!query || query.trim().length === 0) {
//         return;
//       }

//       dispatch(setSearching(true));

//       try {
//         const response = await searchApi.searchProducts({
//           q: query,
//           page,
//           per_page: 12,
//         });

//         dispatch(
//           setSearchResults({
//             results: response.data,
//             totalResults: response.meta.total_products,
//             currentPage: response.meta.current_page,
//             totalPages: response.meta.total_pages,
//           })
//         );
//       } catch (error) {
//         console.error('Search error:', error);
//         dispatch(setError('Failed to search products. Please try again.'));
//       }
//     },
//     [dispatch]
//   );

//   /**
//    * Fetch search suggestions
//    */
//   const fetchSuggestions = useCallback(
//     async (query: string) => {
//       if (!query || query.trim().length < 2) {
//         dispatch(setSuggestions({ products: [], categories: [] }));
//         return;
//       }

//       try {
//         const suggestions = await searchApi.getSearchSuggestions({
//           q: query,
//           limit: 10,
//         });

//         dispatch(setSuggestions(suggestions));
//       } catch (error) {
//         console.error('Suggestions error:', error);
//         // Silently fail for suggestions
//       }
//     },
//     [dispatch]
//   );

//   /**
//    * Handle search input with debouncing
//    */
//   const handleSearch = useCallback(
//     (query: string) => {
//       dispatch(setQuery(query));

//       // Clear existing timeouts
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//       if (suggestionTimeoutRef.current) {
//         clearTimeout(suggestionTimeoutRef.current);
//       }

//       // If query is empty, don't search
//       if (!query || query.trim().length === 0) {
//         return;
//       }

//       // Fetch suggestions faster (300ms)
//       if (query.trim().length >= 2) {
//         suggestionTimeoutRef.current = setTimeout(() => {
//           fetchSuggestions(query);
//         }, SUGGESTION_DELAY);
//       }

//       // Perform full search with longer delay (500ms)
//       if (query.trim().length >= 3) {
//         searchTimeoutRef.current = setTimeout(() => {
//           performSearch(query);
//         }, DEBOUNCE_DELAY);
//       }
//     },
//     [dispatch, performSearch, fetchSuggestions]
//   );

//   /**
//    * Load more results (pagination)
//    */
//   const loadMore = useCallback(
//     (page: number) => {
//       if (searchState.query) {
//         performSearch(searchState.query, page);
//       }
//     },
//     [searchState.query, performSearch]
//   );

//   /**
//    * Open search modal
//    */
//   const handleOpenSearch = useCallback(() => {
//     dispatch(openSearch());
//   }, [dispatch]);

//   /**
//    * Close search modal
//    */
//   const handleCloseSearch = useCallback(() => {
//     dispatch(closeSearch());

//     // Clear timeouts on close
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }
//     if (suggestionTimeoutRef.current) {
//       clearTimeout(suggestionTimeoutRef.current);
//     }
//   }, [dispatch]);

//   /**
//    * Cleanup timeouts on unmount
//    */
//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//       if (suggestionTimeoutRef.current) {
//         clearTimeout(suggestionTimeoutRef.current);
//       }
//     };
//   }, []);

//   return {
//     ...searchState,
//     handleSearch,
//     loadMore,
//     openSearch: handleOpenSearch,
//     closeSearch: handleCloseSearch,
//   };
// }
