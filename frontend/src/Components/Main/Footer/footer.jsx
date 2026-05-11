import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white border-t border-gray-200 px-6 md:px-16 pt-12">

      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-10">

        {/* Brand Column */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-gray-900">Ecofy</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
            Pioneering sustainable waste solutions for a cleaner, greener tomorrow.
          </p>
        </div>

        {/* Services Column */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">Services</h4>
          <ul className="space-y-3">
            {['Commercial Recycling', 'Hazardous Waste', 'AI Sorting Systems', 'Consultancy'].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">Company</h4>
          <ul className="space-y-3">
            {[
              { label: 'About Us', href: '/about' },
              { label: 'Our Journey', href: '/about#journey' },
              { label: 'Careers', href: '#' },
              { label: 'Press Kit', href: '#' },
            ].map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <span>✉</span>
              <a href="mailto:mailhello@ecofy.eco" className="hover:text-green-600 transition-colors">
                mailhello@ecofy.eco
              </a>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <span>📞</span>
              <span>+94 (555) ECO-WASTE</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-500">
              <span>📍</span>
              <span>123 Galle Face, Eco City, OR 97201</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500 text-center">
        <p>© 2026 Ecofy Waste Management. All rights reserved.</p>
        <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
      </div>

    </footer>
  );
};

export default Footer;