import React from "react";

function SomthingWentWrong({ cause, message }) {
  return (
    <div className="">
      <h1>Something Went Wrong</h1>
      <p>Error Code: {cause}</p>
    </div>
  );
}

export default SomthingWentWrong;
