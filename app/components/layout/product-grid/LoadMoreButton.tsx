'use client';

interface LoadMoreButtonProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onClick: () => void;
}

export function LoadMoreButton({
  currentPage,
  totalPages,
  isLoading = false,
  onClick,
}: LoadMoreButtonProps) {
  if (currentPage >= totalPages) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 py-12">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="px-8 py-3 bg-emperador text-primary-foreground uppercase tracking-widest font-medium hover:bg-emperador/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </button>

      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}