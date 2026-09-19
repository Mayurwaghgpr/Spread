import { Link } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function Footer() {
  const icons = useIcons();

  return (
    <footer className="relative bg-transparent text-stone-900 dark:text-stone-100 border-t border-inherit py-12 sm:py-16 px-4 sm:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto flex flex-col gap-10 w-full">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 w-full">
          {/* Logo & Social Links */}
          <div className="flex flex-col items-start gap-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <img
                className="w-10 h-10 object-contain"
                src="/spread_logo_03_robopus.png"
                alt="Spread Logo"
              />
              <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Spread
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-xs leading-relaxed">
              Spread ideas, spark technical conversations, and analyze content with instant AI insights.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                className="spread-pill p-2 rounded-full hover:scale-110 transition-transform"
                to="https://github.com/Mayurwaghgpr/Spread"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <span className="text-sm">{icons["github"]}</span>
              </Link>

              <Link
                className="spread-pill p-2 rounded-full hover:scale-110 transition-transform"
                to="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <span className="text-sm">{icons["linkedin"]}</span>
              </Link>

              <Link
                className="spread-pill p-2 rounded-full hover:scale-110 transition-transform"
                to="https://x.com/mayurwagh152064"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Profile"
              >
                <span className="text-sm">{icons["XCom"]}</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 w-full text-left">
            <div>
              <h4 className="font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <Link to="/features" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/creators" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    For Creators
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Community
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <Link to="/blog" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/showcase" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Showcase
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Support
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <Link to="/help" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-xs sm:text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Legal
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li>
                  <Link to="/privacy" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="pt-6 border-t border-inherit text-xs text-stone-500 dark:text-stone-400 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Spread. All rights reserved.</p>

            <div className="flex items-center gap-1.5 text-xs">
              <span>Developed with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>by</span>
              <Link
                to="https://github.com/Mayurwaghgpr"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-stone-900 dark:text-stone-100 hover:underline"
              >
                Mayur Wagh
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
