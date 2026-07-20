import { Link } from "react-router";
import { Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Categories", to: "/products" },
  { label: "Featured Products", to: "/products" },
  { label: "Flash Sale", to: "/products" },
  { label: "New Arrivals", to: "/products" },
];

const USEFUL_LINKS = [
  { label: "FAQ", to: "/faq" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Return Policy", to: "/return-policy" },
  { label: "Delivery Rules", to: "/delivery-rules" },
  { label: "Contact Us", to: "/contact" },
];

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaWhatsapp, href: "#", label: "WhatsApp" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="inline-block">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background text-lg font-bold text-foreground">
                IS
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-background/70">
              Infinity Store — Your premium destination for quality products at
              unbeatable prices.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-background/50" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-background/50" />
                <span>+880 1XXXXXXXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-background/70 transition-colors duration-200 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Useful Links
            </h3>
            <ul className="space-y-2.5">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-background/70 transition-colors duration-200 hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Connected */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
              Stay Connected
            </h3>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-lg border border-background/20 text-background/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-background/40 hover:text-background"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} Infinity Store. All rights
            reserved.
          </p>
          <div className="flex gap-4 text-xs text-background/50">
            <Link to="/terms" className="hover:text-background">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-background">
              Privacy
            </Link>
            <Link to="/cookies" className="hover:text-background">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
