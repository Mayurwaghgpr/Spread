import React from "react";

const CodeDisplay = ({ code }) => {
  //   const code = `
  // import React from 'react';

  // const HelloWorld = () => {
  //   return <h1>Hello, world!</h1>;
  // };

  // export default HelloWorld;
  //   `;
  return (
    <div className="w-full bg-slate-100 rounded-lg p-4 overflow-auto">
      <pre className="text-sm leading-normal text-gray-800">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeDisplay;
