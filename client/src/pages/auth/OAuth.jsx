import useIcons from "../../hooks/useIcons";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function OAuth({ service, className = "", disabled = false, ...props }) {
  const icons = useIcons();

  if (!service) {
    console.error("OAuth service is undefined");
    return null;
  }

  const handleOAuth = () => {
    if (disabled) return;
    window.location.href = `${BASE_URL}/api/auth/login/${service}`;
  };

  const serviceName = service.charAt(0).toUpperCase() + service.slice(1);

  return (
    <button
      type="button"
      onClick={handleOAuth}
      disabled={disabled}
      className={`spread-pill flex items-center justify-center gap-2.5 px-4 py-2.5 w-full text-xs font-semibold rounded-full transition-all duration-200 hover:scale-[1.02] ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"
      } ${className}`}
      {...props}
    >
      <span className="text-base">{icons[service]}</span>
      <span className="capitalize">Continue with {serviceName}</span>
    </button>
  );
}

export default OAuth;
