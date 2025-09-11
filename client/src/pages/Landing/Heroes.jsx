import coverImg2 from "/OctoCoverImage.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../component/footer/Footer";
import spreadLogo from "/spread_logo_03_robopus.png";
import { motion } from "motion/react";
import ProfileImage from "../../component/ProfileImage";
import ThemeBtn from "../../component/buttons/ThemeBtn";
import useIcons from "../../hooks/useIcons";
function Heroes() {
  const navigate = useNavigate();
  const icons = useIcons();
  const howItWorks = [
    {
      step: "01",
      title: "Create Account",
      desc: "Sign up in seconds and customize your creative profile",
      icon: "person",
    },
    {
      step: "02",
      title: "Share Content",
      desc: "Upload your work, stories, and creative projects",
      icon: "share",
    },
    {
      step: "03",
      title: "Build Community",
      desc: "Connect with like-minded creators and grow together",
      icon: "handshack",
    },
  ];
  const features = [
    {
      icon: "creative",
      title: "Creative Freedom",
      desc: "Express yourself without limits",
      gradient: "from-gray-600 to-black dark:from-gray-300 dark:to-white",
    },
    {
      icon: "earth",
      title: "Global Community",
      desc: "Connect with creators worldwide",
      gradient: "from-black to-gray-700 dark:from-white dark:to-gray-200",
    },
    {
      icon: "grow",
      title: "Grow Together",
      desc: "Build your audience and impact",
      gradient: "from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400",
    },
  ];
  const Modes = [
    {
      name: "Dark mode",
      value: "dark",
      icon: "moonFi",
    },
    {
      name: "Light mode",
      value: "light",
      icon: "sun",
    },
    {
      name: "System",
      value: "system",
      icon: "desktopO",
    },
  ];
  return (
    <main className="relative h-full w-full bg-light dark:bg-black">
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 lg:px-20 py-3  flex justify-between items-center">
        <div>
          {" "}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group transition-all duration-200 hover:opacity-80"
          >
            <ProfileImage
              image={spreadLogo}
              className="w-10 h-10 scale-110 transition-all duration-200"
              alt="Spread Logo"
            />
            <span className="sm:block hidden text-xl font-bold bg-gradient-to-r from-gray-600 to-gray-400 dark:from-gray-700 dark:to-gray-400 bg-clip-text text-transparent">
              Spread
            </span>
          </div>
        </div>{" "}
        <div className=" flex justify-center items-center text-sm  gap-5">
          <ThemeBtn
            className=" text-lg  rounded-full p-2 bg-black/30 "
            Modes={Modes}
          />
          <Link
            to="/auth/signin"
            className="flex  items-center gap-2 sm:px-8 px-3 sm:py-2 py-1 text-xs bg-white text-black rounded-full  transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </header>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden ">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1.5px] h-[1.5px] rounded-full animate-ping bg-white dark:bg-gradient-to-br dark:from-sky-300 dark:to-amber-200  z-20"
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden ">
        <div className="absolute inset-0 z-5 bg-gradient-to-tr from-transparent via-transparent to-gray-200 dark:to-blue-400/30 "></div>
        {/* Content */}
        <div className="relative z-20 flex sm:flex-row flex-col  items-center sm:text-start text-center gap-10 my-20  px-8 sm:px-12  ">
          <div className="transform transition-all duration-700 max-w-3xl">
            {/* Headline */}
            <h1 className="text-xl sm:text-2xl xl:text-4xl font-bold leading-tight mb-8 ">
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text dark:text-transparent">
                Unleash Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-100 to-white bg-clip-text dark:text-transparent">
                Creative Genius
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-lg leading-relaxed mb-8 max-w-2xl dark:text-gray-100">
              Join a <span className="font-semibold ">vibrant community</span>{" "}
              of creators, innovators, and dreamers. Share your vision, discover
              inspiration, and
              <span className="font-semibold ">
                {" "}
                transform ideas into reality
              </span>
              .
            </p>
            {/* sign in button */}
            <div className="flex flex-col sm:flex-row gap-4 sm:mb-12 mb-4 sm:w-full w-fit mx-auto">
              <button
                className="group relative sm:px-6 sm:py-3 px-3 py-2  bg-gradient-to-r text-white from-black to-gray-800 dark:from-white dark:to-gray-200 rounded-full font-bold  dark:text-black sm:text-lg text-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/25 dark:hover:shadow-white/25 border border-gray-600 dark:border-gray-300"
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
            <div className="flex items-center gap-8 text-sm dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="sm:w-8 sm:h-8 h-5 w-5 rounded-full bg-gradient-to-tr from-blue-400 to-white dark:from-gray-200 dark:to-gray-500 border-2 border-white animate-pulse shadow-sm"
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
          <div className="relative max-w-[20rem] max-h-[20rem] sm:w-full sm:h-full w-1/2 rounded-full overflow-hidden ">
            <img
              class="max-w-full h-auto object-cover object-center"
              src={coverImg2}
              alt="cover"
              loading="lazy"
            />
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute sm:right-1/3 left-1/2 transform -translate-x-1/2 sm:bottom-0 bottom-0 animate-bounce">
          <div className="sm:w-6 sm:h-10 w-4 h-7 border-2 border-gray-300 dark:border-gray-200 rounded-full flex justify-center bg-white/10 backdrop-blur-sm">
            <div className="sm:w-1 sm:h-3 w-0.5 h-2 bg-gray-600 dark:bg-gray-200 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      {/* <section className="relative py-20">
        <div className=" absolute inset-0 z-5 bg-gradient-to-bl from-transparent via-transparent to-gray-200 dark:from-black dark:via-transparent dark:to-gray-800 "></div>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-xl sm:text-4xl font-bold mb-12 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Why Creators Choose Spread
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group flex flex-col justify-center items-center text-center p-8 bg-white dark:bg-gray-500/40 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50"
              >
                <span className="text-5xl  mx-auto  mb-4 group-hover:scale-110 transition-transform duration-300 w-fit">
                  {icons[feature.icon]}
                </span>
                <h3 className="sm:text-xl text-lg font-bold text-black dark: mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 sm:text-base text-sm dark:text-gray-400 mb-4">
                  {feature.desc}
                </p>
                <div
                  className={`w-full h-[1px] bg-gradient-to-r ${feature.gradient} rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Statistics Section */}
      {/* <section className="relative py-16 bg-gradient-to-r from-black to-gray-900 dark:from-gray-900 dark:to-black ">
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
      </section> */}

      {/* How It Works Section */}
      <section className="relative py-20 ">
        <div className=" absolute inset-0 z-5 bg-gradient-to-tl from-transparent via-transparent to-gray-200/80 dark:from-black dark:via-transparent dark:to-gray-800 "></div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              How It Works
            </h2>
            <p className="sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and join thousands of creators sharing
              their passion
            </p>
          </div>

          <div className="grid md:grid-row-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-16 left-7 right-1/4 w-0.5 h-full bg-gradient-to-b from-gray-300 via-gray-400 to-transparent dark:from-gray-600 dark:via-gray-500 dark:to-transparent"></div>
            {howItWorks.map((item, i) => (
              <div
                key={i}
                className=" flex items-center justify-start gap-4 relative"
              >
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br  from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-2xl">{icons[item.icon]}</span>
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-200 dark:bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold  dark:text-black">
                      {item.step}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="sm:text-xl text-lg font-bold text-black dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 sm:text-base text-sm dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="relative py-20 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
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
                <blockquote className="text-gray-700 sm:text-base text-sm dark:text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-black dark:">
                    {testimonial.author}
                  </div>
                  <div className="sm:text-sm text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Tools & Features Section */}
      {/* <section className="relative py-20 bg-gradient-to-b from-[#fff9f3] to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
              Powerful Tools for Creators
            </h2>
            <p className="sm:text-lg text-sm text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
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
                <h3 className="font-bold text-black dark: mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Newsletter Section */}
      {/* <section className="relative py-16 bg-black dark:bg-gray-900 ">
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
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-gray-600  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
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
      {/* <section className="relative py-20 bg-gradient-to-br from-[#fff9f3] via-white to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
            Ready to Start Creating?
          </h2>
          <p className="sm:text-xl text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already sharing their passion and
            building amazing communities
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="group px-8 py-4 bg-black dark:bg-white  dark:text-black rounded-full font-bold sm:text-lg text-sm hover:scale-105 transition-all duration-300 hover:shadow-xl"
              onClick={() => navigate("/auth/signin")}
            >
              Get Started Free
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </button>
            <button className="px-8 py-4 border-2 sm:text-base text-sm border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center gap-4 sm:text-sm text-xs text-gray-500 dark:text-gray-400">
            <span>✓ Free forever</span>
            <span>✓ No credit card required</span>
            <span>✓ Start creating in minutes</span>
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  );
}

export default Heroes;
