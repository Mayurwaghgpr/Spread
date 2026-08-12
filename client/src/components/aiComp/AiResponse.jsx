import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AIDrawer from "./AIDrawer";

const AIResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postData = location.state?.postData;

  useEffect(() => {
    // If accessed directly without state, redirect back safely
    if (!postData) {
      navigate("/", { replace: true });
    }
  }, [postData, navigate]);

  if (!postData) return null;

  return (
    <AIDrawer
      isOpen={true}
      onClose={() => navigate(-1)}
      postData={postData}
    />
  );
};

export default AIResponse;
