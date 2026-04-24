import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white">
      {/* Top section: Address + Links + Map */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { label: "Home", to: "/" },
              { label: "Events", to: "/events" },
              { label: "Notices", to: "/notices" },
              { label: "Members", to: "/members" },
              { label: "Commissioner Rotation", to: "/commissioners" },
              { label: "Admin Login", to: "/login" },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Social */}
          {/* <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {[
                {
                  icon: <facebook size={16} />,
                  label: "Facebook",
                  href: "#",
                },
                {
                  icon: <twitter size={16} />,
                  label: "Twitter",
                  href: "#",
                },
                {
                  icon: <linkedin size={16} />,
                  label: "LinkedIn",
                  href: "#",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div> */}
        </div>

        {/* Column 1: About + Address */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
              About
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed mb-5">
              DRT Advocates Association, Hyderabad is the registered body of
              advocates practising before the Debt Recovery Tribunals and the
              Debt Recovery Appellate Tribunal in Hyderabad.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-zinc-400">
              <MapPin size={15} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">
                1st Floor, Triveni Complex, Abids,
                <br />
                Hyderabad, Telangana – 500001, India
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Phone size={15} className="text-primary flex-shrink-0" />
              <a
                href="tel:+919000000000"
                className="hover:text-white transition-colors"
              >
                +91 90000 00000
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Mail size={15} className="text-primary flex-shrink-0" />
              <a
                href="mailto:info@drtadvocateshyd.in"
                className="hover:text-white transition-colors"
              >
                info@drtadvocateshyd.in
              </a>
            </div>
          </div>
        </div>

        {/* social_media_end_here */}

        {/* map_component */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">
            Find Us
          </h3>
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-zinc-700 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d951.855695694559!2d78.47659102849542!3d17.391486678760277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9982ff3217c7%3A0xe98f3470dd032917!2sPalace%20heights!5e0!3m2!1sen!2sin!4v1777025685738!5m2!1sen!2sin"
              width="100%"
              height="100%"
              loading="lazy"
              className="border-0"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="DRT Advocates Association Hyderabad"
            />
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} DRT Advocates Association Hyderabad.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-zinc-300 transition-colors uppercase tracking-wider"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-zinc-300 transition-colors uppercase tracking-wider"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
