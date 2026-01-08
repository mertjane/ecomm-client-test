import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { FooterColumns } from './FooterColumns';
import type { FooterElements } from '@/types/footer-elem';

const footerData: FooterElements = {
  logo: '/logos/Authentic-Stone_Long-logo_NO-strapline_light.png',
  contactInfo: {
    address: 'Unit D2 / A1 Ranalah Estate, New Rd, Newhaven BN9 0EH, UK',
    phone: '01273 434 903',
    email: 'info@authenticstone.co.uk',
  },
  openingHours: {
    weekdays: 'Monday - Friday: 9:00am - 5:30pm',
    saturday: 'Saturday: Closed (Appointments Only)',
    sunday: 'Sunday: Closed',
    bankHolidays: 'Bank Holidays: Closed',
  },
  companyInfo: {
    registrationNo: '07962075',
    vatNo: '134274722',
  },
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Samples', href: '/samples' },
        { label: 'Discover Our Blog', href: '/blog' },
        { label: 'Reviews', href: '/reviews' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact-us' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
        { label: 'Delivery Information', href: '/delivery-information' },
        { label: 'Return & Refund Policy', href: '/return-refund-policy' },
      ],
    },
    {
      title: 'Advice from Specialist',
      links: [
        { label: 'Installation', href: '/installation' },
        { label: 'Adhesive & Grout Advice', href: '/adhevise-grout-advise' },
        { label: 'Sealing Maintenance Advice', href: '/sealing-and-maintenance' },
      ],
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-emperador text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Logo and Contact Info - Left Side */}
          <div className="lg:col-span-5 space-y-8">
            {/* Logo */}
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src={footerData.logo}
                  alt="Authentic Stone"
                  width={400}
                  height={120}
                  className="h-24 w-auto object-fill relative -left-10 -top-8"
                />
              </Link>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 relative -top-20">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-white/80" />
                <p className="text-white/80 text-sm leading-relaxed">
                  {footerData.contactInfo.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-white/80" />
                <a
                  href={`tel:${footerData.contactInfo.phone.replace(/\s/g, '')}`}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {footerData.contactInfo.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-white/80" />
                <a
                  href={`mailto:${footerData.contactInfo.email}`}
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {footerData.contactInfo.email}
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div className='relative -top-22'>
              <div className="flex items-center gap-3 mb-3">
      
                <h6 className="text-white font-semibold uppercase tracking-wide">
                  Warehouse / Showroom Opening Hours
                </h6>
              </div>
              <div className="ml-0 space-y-1 text-sm text-white/80">
                <p>{footerData.openingHours.weekdays}</p>
                <p>{footerData.openingHours.saturday}</p>
                <p>{footerData.openingHours.sunday}</p>
                <p>{footerData.openingHours.bankHolidays}</p>
              </div>
            </div>
          </div>

          {/* Footer Columns - Right Side */}
          <div className="lg:col-span-7">
            <FooterColumns columns={footerData.columns} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            {/* Company Details */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p>Company Registration No: {footerData.companyInfo.registrationNo}</p>
              <span className="hidden md:inline">•</span>
              <p>VAT No: {footerData.companyInfo.vatNo}</p>
            </div>

            {/* Copyright */}
            <p>© {new Date().getFullYear()} Authentic Stone. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
