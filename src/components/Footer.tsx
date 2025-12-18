import { Link } from "react-router-dom";
import { Code2, Mail, Phone, MapPin } from "lucide-react";
import Logo1 from "@/assets/logo-2.png";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
             <div className="logo-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src={Logo1} alt="InvoTech Logo" className="logo" />
            </Link>
          </div>
            <p className="text-sm text-muted-foreground">
              Connecting skilled developers with innovative clients to build the future together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Developers */}
          <div>
            <h3 className="font-semibold mb-4">For Developers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/developer-register" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Join as Developer
                </Link>
              </li>
              <li>
                <Link to="/developer-dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Developer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@invotech.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+918921624007</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Calicut</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InvoTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};