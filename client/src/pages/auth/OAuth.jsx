import React from "react";
import useIcons from "../../hooks/useIcons";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function OAuth({ service, className, ...props }) {
  const icons = useIcons();
  // Ensure the service is correctly used
  if (!service) {
    console.error("OAuth service is undefined");
    return null;
  }

  const handleOAuth = () => {
    window.location.href = `${BASE_URL}/api/auth/login/${service}`;
  };

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className={`flex items-center p-3 w-full justify-center gap-3 rounded-lg ${className}`}
      {...props}
    >
      {icons[service]}
      <span>{service}</span>
    </button>
  );
}

export default OAuth;
