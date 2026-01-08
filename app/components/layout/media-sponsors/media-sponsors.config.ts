// config/media-sponsors.config.ts
import { MediaAndSponsorsConfig } from '@/types/media-sponsors';

export const mediaAndSponsorsConfig: MediaAndSponsorsConfig = {
  mediaPartners: [
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
  ],
  sponsors: [
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
  ]
};