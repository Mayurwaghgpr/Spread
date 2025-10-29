import { useEffect, useState } from "react";
import Heading from "./Heading";

export default function FeatureSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      title: "Dynamic Post Editor",
      description:
        "Write and format your posts effortlessly with our rich text editor that supports code blocks, markdown, and inline styling for a seamless writing experience.",
    },
    // {
    //   title: "Smart Recommendations",
    //   description:
    //     "Discover content tailored to your interests with our AI-powered recommendation system that learns from your reading and interaction patterns.",
    // },
    // {
    //   title: "Real-Time Collaboration",
    //   description:
    //     "Work together with teammates or co-authors in real time. See live edits, comments, and discussions right inside the editor.",
    // },
    {
      title: "AI Post Analytics",
      description:
        "Analize post using AI, Get point by point analysis for each post reparatly",
    },
    {
      title: "Secure Authentication",
      description:
        "Keep your account safe with multi-layered authentication, including OAuth with Google and GitHub, plus encrypted token-based login.",
    },
    {
      title: "Custom Themes",
      description:
        "Personalize your experience with light, dark, and system-based themes that adapt to your device settings automatically.",
    },
    {
      title: "Save for Later",
      description:
        "Bookmark and organize your favorite posts in custom group so you can easily revisit and read them later.",
    },
    {
      title: "Community Interaction",
      description:
        "Like, comment,mention and follow your favorite creators to stay updated and be part of an engaging, growth driven community.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="relative w-full min-h-screen bg-oplight dark:bg-inherit text-white py-20 px-6 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-1000"
          style={{ backgroundColor: features[currentIndex].accent }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-1000"
          style={{
            backgroundColor:
              features[(currentIndex + 3) % features.length].accent,
          }}
        />
      </div>

      <div className="relative space-y-10 max-w-7xl mx-auto">
        {/* Header */}
        <Heading
          title={"Powerful features"}
          subtitle={
            "Everything you need to create, share, and grow your creative journey"
          }
        />

        {/* Feature Display */}
        <div className="relative min-h-[600px] flex items-center justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                currentIndex === index
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="bg-[#fff9f3] text-black rounded-3xl shadow-2xl overflow-hidden h-full">
                <div className="grid md:grid-cols-2 gap-8 p-8 sm:p-12 h-full items-center">
                  {/* Content */}
                  <div className="space-y-6 order-2 md:order-1">
                    <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Image Section */}
                  <div className="relative order-1 md:order-2">
                    <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5  w-full h-80 sm:h-96 flex items-center justify-center overflow-hidden">
                      <img
                        className="relative w-full h-full object-fill rounded-xl"
                        src="/octbot.png"
                        alt={feature.title}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group relative"
            >
              <div className="w-12 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${currentIndex === index ? "bg-gray-500" : "0%"}`}
                  style={{
                    width: currentIndex === index ? "100%" : "0%",
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
