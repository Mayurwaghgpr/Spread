import React, { useEffect, useState } from "react";
import coverImg2 from "../assets/images/coverImage2.jpg";
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer/Footer";
import spreadLogo from "/spread_logo_03_robopus.png";

function Heroes() {
  // const [isVisible, setIsVisible] = useState(false);
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });

  //   // Trigger entrance animation
  //   setTimeout(() => setIsVisible(true), 100);

  //   // Mouse tracking for parallax effect
  //   const handleMouseMove = (e) => {
  //     setMousePosition({
  //       x: (e.clientX / window.innerWidth - 0.5) * 20,
  //       y: (e.clientY / window.innerHeight - 0.5) * 20,
  //     });
  //   };

  //   window.addEventListener("mousemove", handleMouseMove);
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);

  // const Footer = () => (
  //   <footer className="relative bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 text-white py-16 px-4 overflow-hidden">
  //     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,249,243,0.1)_0%,transparent_50%)]"></div>
  //     <div className="relative max-w-6xl mx-auto text-center">
  //       <div className="mb-8">
  //         <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
  //           Join the Creative Revolution
  //         </h3>
  //         <p className="text-orange-100 max-w-2xl mx-auto">
  //           Where ideas meet inspiration, and creativity knows no bounds.
  //         </p>
  //       </div>
  //       <div className="border-t border-orange-700 pt-8">
  //         <p className="text-orange-200">
  //           &copy; 2024 Spread. Empowering creators worldwide.
  //         </p>
  //       </div>
  //     </div>
  //   </footer>
  // );

  return (
    <div className="relative h-full w-full  bg-gradient-to-br from-[#fff9f3] via-orange-50 to-amber-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 opacity-30 rounded-full animate-pulse"
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
      <section className="relative h-screen  flex items-center justify-center overflow-hidden">
        {/* Dynamic Background with Parallax */}
        <div
          className="absolute inset-0 transition-transform duration-75 ease-out "
          // style={{
          //   transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          // }}
        >
          {/* Simulated coverImg2 with warm color palette */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-orange-300 to-red-400"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-300/30 to-orange-400/40"></div>
          <div className="absolute inset-0 opacity-60">
            <img className={"w-full"} src={coverImg2} alt="" />
          </div>

          {/* Floating creative elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-amber-400/30 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-orange-300/30 to-red-400/30 rounded-full blur-lg animate-pulse"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-amber-300/30 to-orange-400/30 rounded-full blur-md animate-ping"></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff9f3]/90 via-[#fff9f3]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fff9f3]/70 via-transparent to-[#fff9f3]/40"></div>

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto py-20  px-6 sm:px-12 flex items-center min-h-screen">
          <div
            className={`animate-slide-in-bottom transform transition-all duration-700 mt-20   max-w-3xl`}
          >
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-amber-200 shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {" "}
                  <img className="w-10" src={spreadLogo} alt="" />
                </span>
              </div>
              <span className="text-amber-900 font-medium tracking-wide">
                Spread
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Headline with Gradient Text */}
            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-amber-800 via-orange-700 to-red-700 bg-clip-text text-transparent">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent animate-pulse">
                Creative Genius
              </span>
            </h1>

            {/* Enhanced Description */}
            <p className="text-xl sm:text-2xl text-amber-800 leading-relaxed mb-8 max-w-2xl">
              Join a{" "}
              <span className="text-orange-600 font-semibold">
                vibrant community
              </span>{" "}
              of creators, innovators, and dreamers. Share your vision, discover
              inspiration, and
              <span className="text-red-600 font-semibold">
                {" "}
                transform ideas into reality
              </span>
              .
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                className="group relative px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
                onClick={() => navigate("/auth/signin")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Start Creating
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              </button>

              {/* <button
                className="px-12 py-5 border-2 border-amber-400 rounded-full font-semibold text-amber-800 text-lg backdrop-blur-sm hover:bg-amber-100 hover:border-orange-400 transition-all duration-300 hover:scale-105"
                onClick={() => console.log("Watch Demo")}
              >
                Watch Demo ▶
              </button> */}
            </div>

            {/* Social Proof with Animation */}
            <div className="flex items-center gap-8 text-sm text-amber-700">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white animate-pulse shadow-sm`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <span className="ml-2">50K+ Active Creators</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-amber-300"></div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Trusted Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Elements */}
        {/* <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-white/90 backdrop-blur-lg rounded-full border border-amber-200 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-all duration-300 hover:scale-110 shadow-lg">
              <span className="text-2xl">💡</span>
            </div>
            <div className="w-16 h-16 bg-white/90 backdrop-blur-lg rounded-full border border-amber-200 flex items-center justify-center cursor-pointer hover:bg-amber-50 transition-all duration-300 hover:scale-110 shadow-lg">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div> */}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-orange-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#fff9f3] to-amber-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
            Why Creators Choose Spread
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Creative Freedom",
                desc: "Express yourself without limits",
                color: "from-amber-400 to-orange-400",
              },
              {
                icon: "🌐",
                title: "Global Community",
                desc: "Connect with creators worldwide",
                color: "from-orange-400 to-red-400",
              },
              {
                icon: "📈",
                title: "Grow Together",
                desc: "Build your audience and impact",
                color: "from-red-400 to-pink-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 bg-white/80 backdrop-blur-lg rounded-2xl border border-amber-200 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-amber-700">{feature.desc}</p>
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
