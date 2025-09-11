import { Link } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function Footer() {
  const icons = useIcons();

  return (
    <footer className="relative bg-gradient-to-r from-transparent via-gray-200/40 to-transparent dark:from-transparent dark:via-gray-900 dark:to-transparent py-16 px-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)]"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="text-center mb-12">
          <h3 className="text-xl sm:text-4xl font-bold mb-4  bg-gradient-to-r from-white to-gray-200 bg-clip-text ">
            Join the Creative Revolution
          </h3>
          <p className=" max-w-2xl mx-auto sm:text-lg text-sm leading-relaxed">
            Where ideas meet inspiration, and creativity knows no bounds.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <Link
            className="group p-3 bg-white/10 hover:bg-white/20 rounded-full border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            to="https://github.com/Mayurwaghgpr/Spread"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className=" group-hover:text-gray-200 text-xl transition-colors duration-200">
              {icons["github"]}
            </span>
          </Link>

          <Link
            className="group p-3 bg-white/10 hover:bg-white/20 rounded-full border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            to="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className=" group-hover:text-gray-200 text-xl transition-colors duration-200">
              {icons["linkedLine"]}
            </span>
          </Link>

          <Link
            className="group p-3 bg-white/10 hover:bg-white/20 rounded-full border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            to="https://x.com/mayurwagh152064"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className=" group-hover:text-gray-200 text-xl transition-colors duration-200">
              {icons["XCom"]}
            </span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-center">
          <div>
            <h4 className="font-semibold  mb-3 sm:text-base text-sm">
              Platform
            </h4>
            <ul className="space-y-2 text-gray-400 sm:text-sm text-xs">
              <li>
                <Link
                  to="/features"
                  className="hover: transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/pricing"
                  className="hover: transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li> */}
              <li>
                <Link
                  to="/creators"
                  className="hover: transition-colors duration-200"
                >
                  For Creators
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold  mb-3  sm:text-base text-sm">
              Community
            </h4>
            <ul className="space-y-2 text-gray-400 sm:text-sm text-xs">
              <li>
                <Link
                  to="/blog"
                  className="hover: transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover: transition-colors duration-200"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/showcase"
                  className="hover: transition-colors duration-200"
                >
                  Showcase
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold  mb-3  sm:text-base text-sm">
              Support
            </h4>
            <ul className="space-y-2 text-gray-400 sm:text-sm text-xs">
              <li>
                <Link
                  to="/help"
                  className="hover: transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover: transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold  mb-3  sm:text-base text-sm">Legal</h4>
            <ul className="space-y-2 text-gray-400 sm:text-sm text-xs">
              <li>
                <Link
                  to="/privacy"
                  className="hover: transition-colors duration-200"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover: transition-colors duration-200"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover: transition-colors duration-200"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8  sm:text-base text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 Spread. Empowering creators worldwide
            </p>

            <div className="flex items-center gap-2 text-gray-400">
              <span>Developed with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>by</span>
              <Link
                to="https://github.com/Mayurwaghgpr"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-gray-200 font-semibold transition-colors duration-200"
              >
                Mayur Wagh
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-fedin2s"></div>
    </footer>
  );
}

export default Footer;
