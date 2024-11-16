import React from "react";

function SomthingWentWrong({ cause, message }) {
  return (
    <div>
      <h1>Something Went Wrong</h1>
      <p>Error Code: {cause}</p>
      <p>{typeof message === "string" ? message : JSON.stringify(message)}</p>
    </div>
  );
}

export default SomthingWentWrong;
