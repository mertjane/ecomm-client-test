'use client';

interface CategoryHeaderProps {
  title: string;
  description?: string;
}

export function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <div className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-foreground mb-4">
            {title}
          </h1>

          {description && (
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {description}
            </p>
          )}

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-emperador to-transparent mx-auto mt-6" />
        </div>
      </div>
    </div>
  );
}