import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setQuery,
  setSearching,
  setSearchResults,
  setQuickResults,
  setError,
  openSearch,
  closeSearch,
} from '../redux/slices/searchSlice';
import { searchApi } from '../api/search';

const DEBOUNCE_DELAY = 300; // 300ms delay for quick search (first 6 results)

export function useSearch() {
  const dispatch = useAppDispatch();
  const searchState = useAppSelector((state) => state.search);

  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Perform the actual search
   */
  const performSearch = useCallback(
    async (query: string, page: number = 1, perPage: number = 12) => {
      if (!query || query.trim().length === 0) {
        return;
      }

      dispatch(setSearching(true));

      try {
        const response = await searchApi.searchProducts({
          q: query,
          page,
          per_page: perPage,
        });

        if (perPage === 6) {
          // Quick results (first 6)
          dispatch(setQuickResults(response.data));
        } else {
          // Full search results
          dispatch(
            setSearchResults({
              results: response.data,
              totalResults: response.meta.total_products,
              currentPage: response.meta.current_page,
              totalPages: response.meta.total_pages,
            })
          );
        }
      } catch (error) {
        console.error('Search error:', error);
        dispatch(setError('Failed to search products. Please try again.'));
      }
    },
    [dispatch]
  );

  /**
   * Handle search input with debouncing
   */
  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setQuery(query));

      // Clear existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // If query is empty, don't search
      if (!query || query.trim().length === 0) {
        return;
      }

      // Show first 6 results quickly when user types
      if (query.trim().length >= 2) {
        searchTimeoutRef.current = setTimeout(() => {
          performSearch(query, 1, 6);
        }, DEBOUNCE_DELAY);
      }
    },
    [dispatch, performSearch]
  );

  /**
   * Load more results (pagination)
   */
  const loadMore = useCallback(
    (page: number) => {
      if (searchState.query) {
        performSearch(searchState.query, page);
      }
    },
    [searchState.query, performSearch]
  );

  /**
   * Open search modal
   */
  const handleOpenSearch = useCallback(() => {
    dispatch(openSearch());
  }, [dispatch]);

  /**
   * Close search modal
   */
  const handleCloseSearch = useCallback(() => {
    dispatch(closeSearch());

    // Clear timeout on close
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, [dispatch]);

  /**
   * Cleanup timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...searchState,
    handleSearch,
    loadMore,
    openSearch: handleOpenSearch,
    closeSearch: handleCloseSearch,
  };
}