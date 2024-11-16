import React from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function OAuth({ service, icon, className, ...props }) {
  // Ensure the service is correctly used
  console.log(BASE_URL);
  if (!service) {
    console.error("OAuth service is undefined");
    return null;
  }

  const handleOAuth = () => {
    window.location.href = `${BASE_URL}/auth/login/${service}`;
  };

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className={`flex items-center p-3 w-full justify-center gap-5 rounded-lg ${className}`}
      {...props}
    >
      {icon}
      <span>Continue with {service}</span>
    </button>
  );
}

export default OAuth;
