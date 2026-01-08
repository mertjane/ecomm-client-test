export interface MediaPartner {
  name: string;
  logo: string;
  alt: string;
}

export interface Sponsor {
  name: string;
  logo: string;
  alt: string;
  website?: string;
}

export interface MediaAndSponsorsConfig {
  mediaPartners: MediaPartner[];
  sponsors: Sponsor[];
}