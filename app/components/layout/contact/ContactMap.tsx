'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface ContactMapProps {
  apiKey?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

export function ContactMap({
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAAk6maQP5wA410ycUnWJZ0OvDIhWdjerI',
  lat = 50.7975764,
  lng = 0.0523944,
  zoom = 14
}: ContactMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Listen for Google Maps errors
    const handleGoogleMapsError = () => {
      setMapError(true);
    };

    window.addEventListener('error', (e) => {
      if (e.message.includes('Google Maps')) {
        handleGoogleMapsError();
      }
    });

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      try {
        initMap();
      } catch (error) {
        setMapError(true);
      }
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        initMap();
      } catch (error) {
        setMapError(true);
      }
    };
    script.onerror = () => {
      setMapError(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, lat, lng, zoom]);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      const location = { lat, lng };
      const map = new google.maps.Map(mapRef.current, {
        zoom,
        center: location,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e0e0e0' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          }
        ]
      });

      new google.maps.Marker({
        position: location,
        map: map,
        title: 'Authentic Stone',
      });

      mapInstanceRef.current = map;
    } catch (error) {
      setMapError(true);
    }
  };

  // Fallback component when map fails to load
  if (mapError) {
    return (
      <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-emperador" />
          <h3 className="text-foreground mb-2">Visit Our Location</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Unit D2 / A1 Ranalah Estate<br />
            New Rd, Newhaven BN9 0EH, UK
          </p>
          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-emperador text-white rounded-md hover:bg-emperador/90 transition-colors text-sm uppercase tracking-wide"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-lg overflow-hidden border border-border"
    />
  );
}
