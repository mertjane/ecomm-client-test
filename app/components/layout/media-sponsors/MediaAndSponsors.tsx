// components/sections/MediaAndSponsors.tsx
import React from 'react';
import Image from 'next/image';

interface MediaPartner {
  name: string;
  logo: string;
  alt: string;
}

interface Sponsor {
  name: string;
  logo: string;
  alt: string;
  website?: string;
}

const mediaPartners: MediaPartner[] = [
  {
    name: 'Channel 4',
    logo: '/images/channel4.png',
    alt: 'Channel 4 logo'
  },
  {
    name: 'Grand Designs',
    logo: '/images/grandd.png',
    alt: 'Grand Designs logo'
  }
];

const sponsors: Sponsor[] = [
  {
    name: 'UNA Eastbourne',
    logo: '/images/unaeastbourne.png',
    alt: 'UNA Eastbourne logo',
    website: 'https://www.una-eastbourne.org'
  },
  {
    name: 'Circus Starr',
    logo: '/images/logo-topHR.png',
    alt: 'Circus Starr logo',
    website: 'https://www.circusstarr.org.uk'
  },
  {
    name: 'Seyvar Kumpanya',
    logo: '/images/kumpanya-logo.png',
    alt: 'Seyvar Kumpanya logo',
    website: 'https://www.seyvarkumpanya.org'
  },
  {
    name: 'Bethel and Teachers',
    logo: '/images/ptfc.png',
    alt: 'Bethel and Teachers logo'
  }
];

export const MediaAndSponsors: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container-padding max-w-7xl mx-auto">
        {/* Media Section */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emperador/10 mb-3">
              As Seen on TV
            </h2>
            <div className="w-20 h-0.5 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 max-w-4xl mx-auto items-center">
            {mediaPartners.map((partner) => (
              <div
                key={partner.name}
                className="group relative bg-white rounded-lg p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[180px]"
              >
                <div className="relative w-full h-24 md:h-28 group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100">
                  <Image
                    src={partner.logo}
                    alt={partner.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative mb-20 md:mb-28">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-neutral-50 px-6 text-neutral-400">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Sponsors Section */}
        <div>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-emperador/10 mb-3">
              Sponsorships & Charities
            </h2>
            <div className="w-20 h-0.5 bg-primary mx-auto mb-4"></div>
            <p className="text-neutral-600 max-w-2xl mx-auto text-sm md:text-base">
              Supporting communities and causes we believe in
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="group relative bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[140px] md:min-h-[160px]"
              >
                {sponsor.website ? (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-full h-20 md:h-24 block"
                  >
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.alt}
                      fill
                      className="object-contain group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </a>
                ) : (
                  <div className="relative w-full h-20 md:h-24">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.alt}
                      fill
                      className="object-contain group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};