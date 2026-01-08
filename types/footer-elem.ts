export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterContactInfo {
  address: string;
  phone: string;
  email: string;
}

export interface FooterOpeningHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  bankHolidays: string;
}

export interface FooterCompanyInfo {
  registrationNo: string;
  vatNo: string;
}

export interface FooterElements {
  logo: string;
  contactInfo: FooterContactInfo;
  openingHours: FooterOpeningHours;
  companyInfo: FooterCompanyInfo;
  columns: FooterColumn[];
}
