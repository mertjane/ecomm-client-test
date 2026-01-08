// components/sections/MediaAndSponsors.refactored.tsx
import React from 'react';
import Image from 'next/image';
import { mediaAndSponsorsConfig } from './media-sponsors.config';
import type { MediaPartner, Sponsor } from '@/types/media-sponsors';

interface LogoCardProps {
  logo: string;
  alt: string;
  href?: string;
  className?: string;
}

const LogoCard: React.FC<LogoCardProps> = ({ logo, alt, href, className = '' }) => {
  const imageElement = (
    <div className={`relative w-full h-20 md:h-24 ${className}`}>
      <Image
        src={logo}
        alt={alt}
        fill
        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {imageElement}
      </a>
    );
  }

  return imageElement;
};

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-12 md:mb-16">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-neutral-900 mb-3">
      {title}
    </h2>
    <div className="w-20 h-0.5 bg-primary mx-auto"></div>
    {subtitle && (
      <p className="text-neutral-600 max-w-2xl mx-auto text-sm md:text-base mt-4">
        {subtitle}
      </p>
    )}
  </div>
);

const SectionDivider: React.FC = () => (
  <div className="relative mb-20 md:mb-28">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <div className="w-full border-t border-neutral-200"></div>
    </div>
    <div className="relative flex justify-center">
      <span className="bg-neutral-50 px-6 text-neutral-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
        </svg>
      </span>
    </div>
  </div>
);

export const MediaAndSponsors: React.FC = () => {
  const { mediaPartners, sponsors } = mediaAndSponsorsConfig;

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container-padding max-w-7xl mx-auto">
        {/* Media Section */}
        <div className="mb-20 md:mb-28">
          <SectionHeader title="As Seen on TV" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-4xl mx-auto items-center">
            {mediaPartners.map((partner: MediaPartner) => (
              <div
                key={partner.name}
                className="group relative bg-white rounded-lg p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[180px]"
              >
                <LogoCard
                  logo={partner.logo}
                  alt={partner.alt}
                  className="h-24 md:h-28"
                />
              </div>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Sponsors Section */}
        <div>
          <SectionHeader
            title="Sponsorships & Charities"
            subtitle="Supporting communities and causes we believe in"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {sponsors.map((sponsor: Sponsor) => (
              <div
                key={sponsor.name}
                className="group relative bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[140px] md:min-h-[160px]"
              >
                <LogoCard
                  logo={sponsor.logo}
                  alt={sponsor.alt}
                  href={sponsor.website}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};