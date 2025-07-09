import React from "react";
import coverImg2 from "../assets/images/coverImage2.jpg";
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer/Footer";
import spreadLogo from "/spread_logo_03_robopus.png";

function Heroes() {
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#fff9f3] via-orange-50 to-amber-50 dark:from-black dark:via-zinc-900 dark:to-black">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 dark:bg-orange-200 opacity-30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 dark:from-black dark:via-zinc-900 dark:to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/30 to-orange-400/40 dark:via-white/10 dark:to-white/10"></div>
          <div className="absolute inset-0 opacity-60">
            <img
              className="w-full opacity-40 dark:opacity-90"
              src={coverImg2}
              alt="cover"
            />
          </div>
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-amber-400/30 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-orange-300/30 to-red-400/30 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-amber-300/30 to-orange-400/30 rounded-full blur-md animate-ping"></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff9f3]/90 via-[#fff9f3]/60 to-transparent dark:from-black/80 dark:via-black/30 dark:to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fff9f3]/70 via-transparent to-[#fff9f3]/40 dark:from-black/60 dark:to-transparent"></div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto py-20 px-6 sm:px-12 flex items-center min-h-screen">
          <div className="animate-slide-in-bottom transform transition-all duration-700 mt-20 max-w-3xl">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 sm:mb-8 mb-4 sm:px-6 sm:py-3 px-3 py-2 bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-full border border-amber-200 dark:border-zinc-700 shadow-lg">
              <div className="sm:w-8 sm:h-8 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <img className="sm:w-10" src={spreadLogo} alt="Logo" />
              </div>
              <span className="text-amber-900 dark:text-orange-100 font-medium tracking-wide">
                Spread
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent dark:from-amber-300 dark:via-orange-300 dark:to-red-300">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent dark:from-orange-300 dark:to-pink-300">
                Creative Genius
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-2xl text-amber-800 dark:text-orange-200 leading-relaxed mb-8 max-w-2xl">
              Join a{" "}
              <span className="text-orange-600 font-semibold dark:text-orange-300">
                vibrant community
              </span>{" "}
              of creators, innovators, and dreamers. Share your vision, discover
              inspiration, and
              <span className="text-red-600 font-semibold dark:text-red-300">
                {" "}
                transform ideas into reality
              </span>
              .
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 sm:mb-12 mb-2">
              <button
                className="group relative sm:px-12 sm:py-5 px-3 py-3 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-full font-bold text-white sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                onClick={() => navigate("/auth/signin")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Start Creating
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 text-sm text-amber-700 dark:text-orange-300">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="sm:w-8 sm:h-8 h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-orange-300 dark:to-orange-500 border-2 border-white animate-pulse shadow-sm"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <span className="ml-2">50K+ Active Creators</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-amber-300 dark:bg-orange-200"></div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Trusted Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute sm:right-1/3 left-1/2 transform -translate-x-1/2 sm:bottom-0 bottom-5 animate-bounce">
          <div className="sm:w-6 sm:h-10 w-4 h-7 border-2 border-amber-400 dark:border-orange-200 rounded-full flex justify-center">
            <div className="sm:w-1 sm:h-3 w-0.5 h-2 bg-orange-500 dark:bg-orange-200 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative py-20 bg-gradient-to-b from-light to-amber-100 dark:from-black dark:to-zinc-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent dark:from-orange-200 dark:to-orange-400">
            Why Creators Choose Spread
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Creative Freedom",
                desc: "Express yourself without limits",
                color:
                  "from-amber-400 to-orange-400 dark:from-orange-300 dark:to-orange-500",
              },
              {
                icon: "🌐",
                title: "Global Community",
                desc: "Connect with creators worldwide",
                color:
                  "from-orange-400 to-red-400 dark:from-orange-400 dark:to-red-500",
              },
              {
                icon: "📈",
                title: "Grow Together",
                desc: "Build your audience and impact",
                color:
                  "from-red-400 to-pink-400 dark:from-red-400 dark:to-pink-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl border border-amber-200 dark:border-zinc-700 hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 dark:text-orange-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-amber-700 dark:text-orange-300">
                  {feature.desc}
                </p>
                <div
                  className={`w-full h-1 bg-gradient-to-r ${feature.color} rounded-full mt-4 opacity-60`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Heroes;
