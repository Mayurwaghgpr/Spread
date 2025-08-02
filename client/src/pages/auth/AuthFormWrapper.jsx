import { Link, useNavigate } from "react-router-dom";
import spreadLogo from "/spread_logo_03_robopus.png";
import ProfileImage from "../../component/ProfileImage";
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
  onChange,
}) {
  const navigate = useNavigate();
  const icons = useIcons();

  return (
    <section className="fixed left-0 right-0 bottom-0 top-0 z-50 flex flex-col sm:flex-row justify-between items-center h-screen  w-full font-light sm:text-sm text-xs bg-light dark:bg-dark overflow-hidden animate-fedin1s border-inherit">
      {/* Error/Validation Banner */}
      {(isError || validation) && (
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-center w-full bg-red-100 py-3 text-red-600 border-b-2 border-red-300">
          <span className="text-sm font-medium">
            {error?.response?.data?.message || validation}
          </span>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-2xl text-gray-600 dark:text-gray-300 transition-colors duration-200"
        aria-label="Close"
      >
        {icons["close"]}
      </button>

      {/* Main Content Container */}
      <div className="flex flex-col sm:flex-row w-full h-full min-h-screen border-inherit">
        {/* Left Side - Form */}
        <div className="flex flex-col justify-center items-center w-full sm:w-1/2 px-6 py-8 sm:px-12 border-inherit">
          {/* Header */}
          <header className="flex flex-col items-center mb-8 text-center">
            <ProfileImage
              image={spreadLogo}
              className="w-20 h-20 mb-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              alt="Spread Logo"
            />
            <h1 className="text-2xl sm:text-3xl font-light text-gray-800 dark:text-white">
              {heading}
            </h1>
          </header>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            onChange={onChange}
            className="w-full max-w-sm space-y-4 border-inherit"
          >
            {children}

            {/* Form Type Toggle */}
            {formType && (
              <footer className="text-center pt-6 text-inherit">
                <p className=" text-gray-600 dark:text-gray-400">
                  {formType === "signup"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                  <Link
                    to={`/auth/${formType === "signup" ? "signin" : "signup"}`}
                    replace={true}
                    className="ml-1 dark:text-slate-400 dark:hover:text-slate-600 text-gray-800 hover:text-gray-950 font-normal transition-colors duration-200"
                  >
                    {formType === "signup" ? "Sign In" : "Sign Up"}
                  </Link>
                </p>
              </footer>
            )}
          </form>
        </div>

        {/* Right Side - Decorative Image */}
        <div className="hidden sm:block w-1/2 h-full min-h-screen relative overflow-hidden">
          <img
            className="w-full h-full object-cover object-center"
            src={octbot}
            alt="Decorative illustration"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

export default AuthFormWrapper;
