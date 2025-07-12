import React from "react";
import useSettings from "../hooks/useSettings";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const settings = useSettings();

  if (!settings || !settings.footer) {
    return <footer className="h-32 bg-teal-800 animate-pulse" />;
  }

  const { footer, logoUrl } = settings;

  return (
    <footer className="bg-teal-800 text-white pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 border-b border-teal-700">
          {/* Logo + Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={logoUrl}
                alt="Logo"
                className="h-10 w-10 object-contain rounded-full bg-white"
              />
              <span className="font-extrabold text-xl font-montserrat tracking-tight bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 bg-clip-text text-transparent drop-shadow">
  {settings.siteName}
</span>

            </div>
            <p className="text-gray-200 text-sm">{footer.description}</p>
          </div>

          {/* Shop Info */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Shop Info</h3>
            <ul className="space-y-2 text-gray-200 text-sm">
              {footer.shopInfo.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    className="hover:text-white transition"
                    target={link.url.startsWith('http') ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-3 mt-4">
              <a href={footer.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF className="hover:text-white text-xl" />
              </a>
              <a href={footer.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="hover:text-white text-xl" />
              </a>
              <a href={footer.socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className="hover:text-white text-xl" />
              </a>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Customer Care</h3>
            <ul className="space-y-2 text-gray-200 text-sm">
              {footer.customerCare.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} className="hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Contact Info</h3>
            <ul className="space-y-2 text-gray-200 text-sm">
              <li className="flex items-start">
                <span className="mr-2 mt-0.5">📍</span>
                <span>
                  {footer.contact.address.split("\n").map((line, idx) => (
                    <React.Fragment key={idx}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <a href={`tel:${footer.contact.phone.replace(/[^+\d]/g, "")}`}>
                  {footer.contact.phone}
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <a href={`mailto:${footer.contact.email}`}>
                  {footer.contact.email}
                </a>
              </li>
              <li className="flex items-center">
                <span className="mr-2">⏰</span>
                {footer.contact.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 text-sm text-gray-200 gap-2">
          <span>
            &copy; {new Date().getFullYear()} Natraj Book Depot. All Right Reserved.
          </span>
          <span>{footer.credit}</span>
          <div className="flex space-x-4">
            {footer.legal.map((item, idx) => (
              <a key={idx} href={item.url} className="hover:text-white transition">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
