import React from "react";
import coverImg2 from "/OctoCoverImage.png";
import { useNavigate } from "react-router-dom";
import Footer from "../component/footer/Footer";
import spreadLogo from "/spread_logo_03_robopus.png";
import { motion } from "motion/react";
function Heroes() {
  const navigate = useNavigate();

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#fff9f3] via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden ">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-ping bg-white dark:bg-cyan-500 z-20"
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
        <motion.div className="box" />
        <div className="absolute inset-0 ">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover object-center "
              src={coverImg2}
              alt="cover"
              loading="lazy"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto py-20 px-6 sm:px-12 flex items-center min-h-screen text-white">
          <div className="transform transition-all duration-700 mt-20 max-w-3xl">
            {/* Logo Badge */}
            <div className="inline-flex items-center gap-3 sm:mb-8 mb-4 sm:px-6 sm:py-3 px-3 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-gray-300/30 dark:border-gray-600/50 shadow-lg hover:bg-white/20 transition-all duration-300">
              <div className="sm:w-8 sm:h-8 w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                <img
                  className="sm:w-10"
                  src={spreadLogo}
                  alt="Logo"
                  loading="lazy"
                />
              </div>
              <span className="font-medium tracking-wide text-white">
                Spread
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-bold leading-tight mb-8 text-white">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent">
                Creative Genius
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-2xl leading-relaxed mb-8 max-w-2xl text-gray-100">
              Join a{" "}
              <span className="font-semibold text-white">
                vibrant community
              </span>{" "}
              of creators, innovators, and dreamers. Share your vision, discover
              inspiration, and
              <span className="font-semibold text-white">
                {" "}
                transform ideas into reality
              </span>
              .
            </p>
            {/* sign in button */}
            <div className="flex flex-col sm:flex-row gap-4 sm:mb-12 mb-2">
              <button
                className="group relative sm:px-12 sm:py-5 px-6 py-4 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-full font-bold text-white dark:text-black sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/25 dark:hover:shadow-white/25 border border-gray-600 dark:border-gray-300"
                onClick={() => navigate("/auth/signin")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center justify-center gap-2">
                  Start Creating
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-8 text-sm text-gray-200 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="sm:w-8 sm:h-8 h-5 w-5 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 dark:from-gray-200 dark:to-gray-500 border-2 border-white animate-pulse shadow-sm"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <span className="ml-2">50K+ Active Creators</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-400 dark:bg-gray-200"></div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Trusted Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute sm:right-1/3 left-1/2 transform -translate-x-1/2 sm:bottom-0 bottom-5 animate-bounce">
          <div className="sm:w-6 sm:h-10 w-4 h-7 border-2 border-gray-300 dark:border-gray-200 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
            <div className="sm:w-1 sm:h-3 w-0.5 h-2 bg-gray-600 dark:bg-gray-200 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#fff9f3] to-white dark:from-black dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Why Creators Choose Spread
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Creative Freedom",
                desc: "Express yourself without limits",
                gradient:
                  "from-gray-600 to-black dark:from-gray-300 dark:to-white",
              },
              {
                icon: "🌐",
                title: "Global Community",
                desc: "Connect with creators worldwide",
                gradient:
                  "from-black to-gray-700 dark:from-white dark:to-gray-200",
              },
              {
                icon: "📈",
                title: "Grow Together",
                desc: "Build your audience and impact",
                gradient:
                  "from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 bg-white/90 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.desc}
                </p>
                <div
                  className={`w-full h-1 bg-gradient-to-r ${feature.gradient} rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-16 bg-gradient-to-r from-black to-gray-900 dark:from-gray-900 dark:to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Creators" },
              { number: "2M+", label: "Projects Shared" },
              { number: "150+", label: "Countries" },
              { number: "99%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div
                key={i}
                className="group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm sm:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 bg-[#fff9f3] dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and join thousands of creators sharing
              their passion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600"></div>

            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up in seconds and customize your creative profile",
                icon: "👤",
              },
              {
                step: "02",
                title: "Share Content",
                desc: "Upload your work, stories, and creative projects",
                icon: "📤",
              },
              {
                step: "03",
                title: "Build Community",
                desc: "Connect with like-minded creators and grow together",
                icon: "🤝",
              },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white dark:text-black">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              What Creators Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Spread transformed how I share my art. The community is incredibly supportive and inspiring.",
                author: "Sarah Chen",
                role: "Digital Artist",
                avatar: "👩‍🎨",
              },
              {
                quote:
                  "I've connected with creators from around the world. It's amazing how ideas flow here.",
                author: "Marcus Johnson",
                role: "Content Creator",
                avatar: "👨‍💻",
              },
              {
                quote:
                  "The platform is intuitive and the feedback I get helps me grow as a creator.",
                author: "Elena Rodriguez",
                role: "Writer",
                avatar: "👩‍✍️",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-black dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools & Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#fff9f3] to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Powerful Tools for Creators
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to create, share, and grow your creative
              journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              // { icon: "🎥", title: "Video Sharing", desc: "HD video uploads" },
              {
                icon: "📸",
                title: "Photo Gallery",
                desc: "Stunning portfolios",
              },
              { icon: "✍️", title: "Story Editor", desc: "Rich text editor" },
              { icon: "💬", title: "Live Chat", desc: "Real-time discussions" },
              { icon: "🤖", title: "Ai Analytics", desc: "Track your growth" },
              { icon: "🎯", title: "Collaboration", desc: "Work together" },
              {
                icon: "🔒",
                title: "Privacy Control",
                desc: "Your content, your rules",
              },
              { icon: "🌟", title: "Recognition", desc: "Get featured" },
            ].map((tool, i) => (
              <div
                key={i}
                className="group p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h3 className="font-bold text-black dark:text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="relative py-16 bg-black dark:bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get the latest updates, creator spotlights, and inspiration
            delivered to your inbox
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
            />
            <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section> */}

      {/* Final CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#fff9f3] via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already sharing their passion and
            building amazing communities
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="group px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
              onClick={() => navigate("/auth/signin")}
            >
              Get Started Free
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
            <button className="px-8 py-4 border-2 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>✓ Free forever</span>
            <span>✓ No credit card required</span>
            <span>✓ Start creating in minutes</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Heroes;
