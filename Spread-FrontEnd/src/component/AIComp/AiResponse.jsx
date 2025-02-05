import React from "react";

const AIResponse = ({ data }) => {
  if (!data)
    return <p className="text-white text-center text-xl">Loading...</p>;

  return (
    <div className="max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mx-auto p-8 shadow-2xl rounded-2xl border border-blue-500/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-500 opacity-10 blur-3xl"></div>
      <div className="relative z-10">
        <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
          🤖 AI-Powered Analysis
        </h1>

        {/* Summary */}
        <section className="mb-8 border-l-4 border-blue-400 pl-4">
          <h2 className="text-2xl font-bold text-blue-400">Summary</h2>
          <p className="mt-2 leading-relaxed">{data.summary}</p>
        </section>

        {/* Analysis */}
        <section className="mb-8 border-l-4 border-purple-400 pl-4">
          <h2 className="text-2xl font-bold text-purple-400">Analysis</h2>
          <p className="mt-2 leading-relaxed">{data.analysis}</p>
        </section>

        {/* Suggestions */}
        <section className="mb-8 border-l-4 border-green-400 pl-4">
          <h2 className="text-2xl font-bold text-green-400">Suggestions</h2>
          <ul className="list-disc mt-2 ml-6 space-y-1">
            {data.suggestions.resources.map((resource, index) => (
              <li key={index} className="text-gray-300">
                {resource}
              </li>
            ))}
          </ul>
        </section>

        {/* Actionable Advice */}
        <section className="mb-8 border-l-4 border-yellow-400 pl-4">
          <h2 className="text-2xl font-bold text-yellow-400">
            Actionable Advice
          </h2>
          <p className="mt-2 leading-relaxed">{data.actionableAdvice}</p>
        </section>

        {/* Resources */}
        <section className="border-l-4 border-red-400 pl-4">
          <h2 className="text-2xl font-bold text-red-400">Resources</h2>
          <ul className="list-disc mt-2 ml-6 space-y-2">
            {data.resources.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:text-blue-500 transition duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AIResponse;
