'use client';

import { cn } from '@/lib/utils';

interface PageContentProps {
  title: string;
  content: string;
  className?: string;
}

export function PageContent({ title, content, className }: PageContentProps) {
  return (
    <article className={cn('container mx-auto px-4 py-12', className)}>
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-foreground mb-8 pb-6 border-b border-border">
          {title}
        </h1>

        {/* Page Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-sans prose-headings:uppercase prose-headings:tracking-wide
            prose-h2:text-foreground prose-h2:border-b prose-h2:border-border prose-h2:pb-4 prose-h2:mb-6
            prose-h3:text-foreground prose-h3:mt-8 prose-h3:mb-4
            prose-h4:text-foreground prose-h4:mt-6 prose-h4:mb-3
            prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-emperador prose-a:underline-offset-4 hover:prose-a:text-emperador/80
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
            prose-li:text-foreground prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-emperador prose-blockquote:pl-6 prose-blockquote:italic
            prose-img:rounded-lg prose-img:shadow-lg
            prose-table:border-collapse prose-table:w-full
            prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-border
            prose-td:p-3 prose-td:border prose-td:border-border"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </article>
  );
}
