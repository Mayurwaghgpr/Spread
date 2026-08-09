import { Link, useNavigate } from "react-router-dom";
import spreadLogo from "/spread_logo_03_robopus.png";
import ProfileImage from "../../components/ProfileImage";
import octbot from "/octbot.png";
import useIcons from "../../hooks/useIcons";

function AuthFormWrapper({
  children,
  onSubmit,
  formType,
  validation,
  isError,
  error,
  heading,
  isLoading,
  onChange,
}) {
  const navigate = useNavigate();
  const icons = useIcons();

  return (
    <section className="fixed inset-0 w-full h-full min-h-screen z-50 flex bg-light dark:bg-dark text-stone-900 dark:text-stone-100 overflow-y-auto border-inherit">
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-2 rounded-full spread-pill hover:scale-105 text-lg sm:text-xl transition-transform"
        aria-label="Close auth page"
      >
        {icons["close"]}
      </button>

      {/* Fullscreen 100% Viewport Container */}
      <div className="flex flex-col md:flex-row w-full h-full min-h-screen border-inherit">
        {/* Left Side - Compact Responsive Form Column */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 h-full min-h-screen p-4 sm:p-6 lg:p-8 border-inherit my-auto overflow-y-auto">
          <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center py-4">
            {/* Compact Header */}
            <header className="flex flex-col items-center gap-1.5 mb-3 text-center w-full">
              {/* Error/Validation Banner */}
              {(isError || validation) && (
                <div className="w-full bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium text-center animate-in fade-in">
                  {error?.response?.data?.message || validation}
                </div>
              )}
              <ProfileImage
                image={spreadLogo}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md hover:scale-105 transition-transform duration-300 border border-inherit"
                alt="Spread Logo"
              />
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">
                {heading}
              </h1>
            </header>

            {/* Form Content */}
            <form
              onSubmit={onSubmit}
              onChange={onChange}
              className="w-full space-y-2 border-inherit"
            >
              {children}

              {/* Form Type Toggle Footer */}
              {formType && (
                <footer className="text-center pt-3 border-t border-inherit text-xs">
                  <p className="text-stone-600 dark:text-stone-400 font-medium">
                    {formType === "signup"
                      ? "Already have an account?"
                      : "Don't have an account?"}
                    <Link
                      to={`/auth/${formType === "signup" ? "signin" : "signup"}`}
                      replace={true}
                      className="ml-1.5 text-stone-900 dark:text-stone-100 font-bold hover:underline"
                    >
                      {formType === "signup" ? "Sign In" : "Sign Up"}
                    </Link>
                  </p>
                </footer>
              )}
            </form>
          </div>
        </div>

        {/* Right Side - Fullscreen Decorative Artwork Column */}
        <div className="hidden md:flex md:w-1/2 min-h-screen bg-[#f5f1ec] dark:bg-[#121212] border-l border-inherit relative overflow-hidden items-center justify-center p-8">
          <div className="relative w-full max-w-md flex flex-col justify-center items-center text-center z-10 space-y-6 my-auto">
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-inherit shadow-2xl p-2 bg-light dark:bg-dark">
              <img
                className="w-full h-full object-cover rounded-full"
                src={octbot}
                alt="Spread Mascot"
                loading="lazy"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl lg:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                Welcome to Spread
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm">
                Connect with creators, write technical stories, and analyze content with real-time AI assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthFormWrapper;
