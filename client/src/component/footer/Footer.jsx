import { Link } from "react-router-dom";
import useIcons from "../../hooks/useIcons";

function Footer() {
  const icons = useIcons();

  return (
    <footer className="relative bg-inherit dark:bg-inherit  bg-gradient-to-r  dark:from-transparent dark:via-gray-900 dark:to-transparent p-10 h-[20rem]  overflow-hidden">
      <div className="relative max-w-6xl  mx-auto flex flex-col justify-center items-center gap-10 min-h-full">
        <div className=" relative flex items-center justify-start gap-20 text-nowrap w-full">
          <div className="flex flex-col  items-start justify-start gap-5 text-nowrap h-full ">
            <div className="flex items-center justify-start ">
              <img
                className="w-16 h-16"
                src="spread_logo_03_robopus.png"
                alt=""
              />
              <span className="text-xl font-medium">Spread</span>
            </div>

            {/* Social Links */}
            <div className="flex justify-center items-center gap-6 w-fit">
              <Link
                className="group p-2 bg-white/10 hover:bg-white/20 rounded-full border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                to="https://github.com/Mayurwaghgpr/Spread"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="  text-xs transition-colors duration-200">
                  {icons["github"]}
                </span>
              </Link>

              <Link
                className="group p-2 bg-white/10 hover:bg-white/20 rounded-full border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                to="https://www.linkedin.com/in/mayur-wagh-751b8a24b/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="  text-xs transition-colors duration-200">
                  {icons["linkedLine"]}
                </span>
              </Link>

              <Link
                className="group p-2 bg-white/10 hover:bg-white/20 rounded-full border border-gray-600 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                to="https://x.com/mayurwagh152064"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="  text-xs transition-colors duration-200">
                  {icons["XCom"]}
                </span>
              </Link>
            </div>
          </div>
          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-28  text-start">
            <div>
              <h4 className="font-semibold  mb-3 sm:text-base text-sm">
                Platform
              </h4>
              <ul className="space-y-2  sm:text-sm text-xs">
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
              <ul className="space-y-2  sm:text-sm text-xs">
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
              <ul className="space-y-2  sm:text-sm text-xs">
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
              <h4 className="font-semibold  mb-3  sm:text-base text-sm">
                Legal
              </h4>
              <ul className="space-y-2  sm:text-sm text-xs">
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
          </div>{" "}
        </div>
        {/* Bottom Section */}
        <div className=" border-gray-700  text-xs w-full">
          <div className="flex md:flex-row flex-col justify-between items-start gap-4">
            <p className=" text-center">
              &copy; {new Date().getFullYear()} Spread.
            </p>

            <div className="flex items-center gap-2 text-xs ">
              <span>Developed with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>by</span>
              <Link
                to="https://github.com/Mayurwaghgpr"
                target="_blank"
                rel="noopener noreferrer"
                className="  font-semibold transition-colors duration-200"
              >
                Mayur Wagh
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent animate-fedin2s"></div>
    </footer>
  );
}

export default Footer;
