import Link from 'next/link';
import type { FooterColumn } from '@/types/footer-elem';

interface FooterColumnsProps {
  columns: FooterColumn[];
}

export function FooterColumns({ columns }: FooterColumnsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {columns.map((column, index) => (
        <div key={index}>
          <h3 className="text-white font-semibold text-lg uppercase tracking-wide mb-4">
            {column.title}
          </h3>
          <ul className="space-y-3">
            {column.links.map((link, linkIndex) => (
              <li key={linkIndex}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
