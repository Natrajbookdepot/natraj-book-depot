import React from 'react';
import useSettings from '../hooks/useSettings';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const settings = useSettings();
  if (!settings || !settings.footer) {
    return <footer className="h-32 bg-teal-800 animate-pulse" />;
  }
  const { footer, logoUrl } = settings;

  return (
    <footer className="bg-teal-800 text-white pt-10">
      {/* ...rest unchanged... */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <img src={logoUrl} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold">Natraj Book Depot</span>
        </div>
        <p className="text-gray-300">{footer.description}</p>
        {/* ...rest unchanged... */}
        <ul className="space-y-1 text-gray-300">
          <li>Natraj Book Depot</li>
          <li>Sipri Bazar, Jhansi</li>
          <li>UP India – 284003</li>
          <li>📞 {footer.contact.phone}</li>
          <li>✉️ {footer.contact.email}</li>
          <li>⏰ {footer.contact.hours}</li>
        </ul>
      </div>
      {/* ...rest unchanged... */}
    </footer>
  );
}
